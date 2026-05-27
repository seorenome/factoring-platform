import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import {
  FormContainer,
  FormHeader,
  StepsProgress,
  StepIndicator,
  StepDot,
  StepLabel,
  FormBody,
  FormFooter,
  DocumentGrid,
  DocumentCard,
  FormGroup,
  FormLabel,
  FormInput,
  TwoColGrid,
  ChoiceGrid,
  ChoiceButton,
  FactoringTypeCard,
  FactoringTypeTitle,
  FactoringTypeDesc,
  CalcCard,
  CalcRow,
  SummarySection,
  SummaryTitle,
  SummaryGrid,
  SummaryLabel,
  SummaryValue
} from './CreateRequest.styled';
import { FileText, ArrowLeft, ArrowRight, Save, TrendingUp } from 'lucide-react';

interface MockDoc {
  id: string;
  name: string;
  type: 'invoice' | 'act';
  number: string;
  supplier: string;
  debtor: string;
  debtorEdrpou: string;
  amount: number;
}

const MOCK_DOCUMENTS: MockDoc[] = [
  {
    id: 'doc-1',
    name: 'Рахунок-фактура №142.pdf',
    type: 'invoice',
    number: '142',
    supplier: 'ТОВ "Постач-Пром"',
    debtor: 'ТОВ "Рітейл Груп"',
    debtorEdrpou: '87654321',
    amount: 250000
  },
  {
    id: 'doc-2',
    name: 'Видаткова накладна ВН-88.pdf',
    type: 'act',
    number: 'ВН-88',
    supplier: 'ТОВ "Постач-Пром"',
    debtor: 'ТОВ "Рітейл Груп"',
    debtorEdrpou: '87654321',
    amount: 250000
  },
  {
    id: 'doc-3',
    name: 'Рахунок-фактура №221.pdf',
    type: 'invoice',
    number: '221',
    supplier: 'ФОП Коваленко',
    debtor: 'ТОВ "Еко-Маркет"',
    debtorEdrpou: '55555555',
    amount: 120000
  },
  {
    id: 'doc-4',
    name: 'Видаткова накладна ВН-12.pdf',
    type: 'act',
    number: 'ВН-12',
    supplier: 'ФОП Коваленко',
    debtor: 'ТОВ "Еко-Маркет"',
    debtorEdrpou: '55555555',
    amount: 120000
  }
];

export const CreateRequest: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docAmounts, setDocAmounts] = useState<Record<string, number>>({});
  const [partialUse, setPartialUse] = useState<Record<string, boolean>>({});

  const [debtorName, setDebtorName] = useState('');
  const [debtorEdrpou, setDebtorEdrpou] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  const [factoringType, setFactoringType] = useState<'classical' | 'reverse' | 'closed'>('classical');
  const [recourseType, setRecourseType] = useState<'recourse' | 'non-recourse'>('recourse');
  const [financingPercent, setFinancingPercent] = useState(80);
  const [interestRate, setInterestRate] = useState(18);
  const [commissionRate, setCommissionRate] = useState(1.5);

  useEffect(() => {
    if (selectedDocIds.length > 0) {
      const firstSelectedDoc = MOCK_DOCUMENTS.find(doc => doc.id === selectedDocIds[0]);
      if (firstSelectedDoc) {
        setDebtorName(firstSelectedDoc.debtor);
        setDebtorEdrpou(firstSelectedDoc.debtorEdrpou);
      }
    }
  }, [selectedDocIds]);

  const toggleDocSelection = (docId: string) => {
    const doc = MOCK_DOCUMENTS.find(d => d.id === docId);
    if (!doc) return;

    if (selectedDocIds.includes(docId)) {
      setSelectedDocIds(prev => prev.filter(id => id !== docId));
    } else {
      setSelectedDocIds(prev => [...prev, docId]);
      if (!docAmounts[docId]) {
        setDocAmounts(prev => ({ ...prev, [docId]: doc.amount }));
      }
    }
  };

  const handlePartialCheck = (docId: string, isPartial: boolean, maxVal: number) => {
    setPartialUse(prev => ({ ...prev, [docId]: isPartial }));
    if (!isPartial) {
      setDocAmounts(prev => ({ ...prev, [docId]: maxVal }));
    }
  };

  const handleAmountChange = (docId: string, val: number, maxVal: number) => {
    const cleaned = Math.min(Math.max(val, 0), maxVal);
    setDocAmounts(prev => ({ ...prev, [docId]: cleaned }));
  };

  const calculateTotalAmount = () => {
    return selectedDocIds.reduce((sum, docId) => sum + (docAmounts[docId] || 0), 0);
  };

  const totalAmount = calculateTotalAmount();
  const financingAmount = (totalAmount * financingPercent) / 100;
  const commissionAmount = (totalAmount * commissionRate) / 100;
  const yearlyInterest = (financingAmount * interestRate) / 100;
  const monthInterest = yearlyInterest / 12;

  const generateRequestNumber = () => {
    const random = Math.floor(Math.random() * 900) + 100;
    return `REQ-${random}`;
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const firstDoc = MOCK_DOCUMENTS.find(doc => doc.id === selectedDocIds[0]);
    const supplierId = user.id;
    const supplierName = firstDoc?.supplier || 'Невідомий постачальник';
    const debtorId = 1;
    const requestNumber = generateRequestNumber();

    const requestData = {
      requestNumber,
      supplierId,
      supplierName,
      debtorId,
      debtorName,
      debtorEdrpou,
      amount: totalAmount,
      financingAmount,
      factoringType,
      recourseType,
      paymentDate,
      status: 'pending' as const
    };

    try {
      await api.createRequest(requestData);
      navigate('/requests');
    } catch (error) {
      console.error('Failed to create request:', error);
      alert('Помилка при створенні заявки');
    } finally {
      setLoading(false);
    }
  };

  const getTypeNameCapital = (type: string) => {
    if (type === 'classical') return t.createRequest.classical;
    if (type === 'reverse') return t.createRequest.reverse;
    return t.createRequest.closed;
  };

  const getSubtypeNameCapital = (type: string) => {
    return type === 'recourse' ? t.createRequest.recourse : t.createRequest.nonRecourse;
  };

  return (
    <Layout>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/requests')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> {t.createRequest.back}
        </button>
      </div>

      <DashboardHeader style={{ marginBottom: '2rem' }}>
        <Title>{t.createRequest.title}</Title>
      </DashboardHeader>

      <FormContainer>
        <FormHeader>
          <StepsProgress>
            <StepIndicator $active={currentStep === 1} $completed={currentStep > 1}>
              <StepDot $active={currentStep === 1} $completed={currentStep > 1}>1</StepDot>
              <StepLabel $active={currentStep === 1}>{t.createRequest.step1Title.split(':')[0]}</StepLabel>
            </StepIndicator>
            <StepIndicator $active={currentStep === 2} $completed={currentStep > 2}>
              <StepDot $active={currentStep === 2} $completed={currentStep > 2}>2</StepDot>
              <StepLabel $active={currentStep === 2}>{t.createRequest.step2Title.split(':')[0]}</StepLabel>
            </StepIndicator>
            <StepIndicator $active={currentStep === 3} $completed={currentStep > 3}>
              <StepDot $active={currentStep === 3} $completed={currentStep > 3}>3</StepDot>
              <StepLabel $active={currentStep === 3}>{t.createRequest.step3Title.split(':')[0]}</StepLabel>
            </StepIndicator>
            <StepIndicator $active={currentStep === 4} $completed={currentStep > 4}>
              <StepDot $active={currentStep === 4} $completed={currentStep > 4}>4</StepDot>
              <StepLabel $active={currentStep === 4}>{t.createRequest.step4Title.split(':')[0]}</StepLabel>
            </StepIndicator>
          </StepsProgress>
        </FormHeader>

        <FormBody>
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>{t.createRequest.step1Title}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                {t.createRequest.step1Desc}
              </p>

              <DocumentGrid>
                {MOCK_DOCUMENTS.map(doc => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  const isPartial = partialUse[doc.id] || false;
                  return (
                    <DocumentCard
                      key={doc.id}
                      $selected={isSelected}
                      onClick={() => toggleDocSelection(doc.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                          />
                          <FileText size={24} color={isSelected ? '#2563eb' : '#6b7280'} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.125rem' }}>
                              {t.requests.supplier}: {doc.supplier} • {t.requests.debtor}: {doc.debtor}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                            ₴ {doc.amount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>{t.createRequest.totalInvoices}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            borderTop: '1px solid #e5e5e5',
                            paddingTop: '1rem',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1.5rem'
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={isPartial}
                              onChange={(e) => handlePartialCheck(doc.id, e.target.checked, doc.amount)}
                            />
                            {t.createRequest.partialUse}
                          </label>

                          {isPartial && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{t.createRequest.usageAmount}:</span>
                              <input
                                type="number"
                                value={docAmounts[doc.id] || 0}
                                onChange={(e) => handleAmountChange(doc.id, Number(e.target.value), doc.amount)}
                                style={{
                                  padding: '0.375rem 0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem',
                                  width: '120px',
                                  fontSize: '0.875rem',
                                  textAlign: 'right'
                                }}
                              />
                              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>грн</span>
                            </div>
                          )}
                        </div>
                      )}
                    </DocumentCard>
                  );
                })}
              </DocumentGrid>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>{t.createRequest.step2Title}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                {t.createRequest.step2Desc}
              </p>

              <FormGroup>
                <FormLabel>{t.createRequest.debtorNameLabel}</FormLabel>
                <FormInput
                  type="text"
                  value={debtorName}
                  onChange={(e) => setDebtorName(e.target.value)}
                  placeholder="Введіть назву юридичної особи"
                />
              </FormGroup>

              <TwoColGrid>
                <FormGroup>
                  <FormLabel>{t.createRequest.debtorEdrpouLabel}</FormLabel>
                  <FormInput
                    type="text"
                    value={debtorEdrpou}
                    onChange={(e) => setDebtorEdrpou(e.target.value)}
                    placeholder="8-значний цифровий код"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t.createRequest.paymentDateLabel}</FormLabel>
                  <FormInput
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </FormGroup>
              </TwoColGrid>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>{t.createRequest.step3Title}</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <FormLabel style={{ display: 'block', marginBottom: '0.75rem' }}>{t.createRequest.factoringTypeLabel}</FormLabel>
                <ChoiceGrid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <FactoringTypeCard
                    $selected={factoringType === 'classical'}
                    onClick={() => setFactoringType('classical')}
                  >
                    <FactoringTypeTitle>{t.createRequest.classical}</FactoringTypeTitle>
                    <FactoringTypeDesc>{t.createRequest.classical}</FactoringTypeDesc>
                  </FactoringTypeCard>
                  <FactoringTypeCard
                    $selected={factoringType === 'reverse'}
                    onClick={() => setFactoringType('reverse')}
                  >
                    <FactoringTypeTitle>{t.createRequest.reverse}</FactoringTypeTitle>
                    <FactoringTypeDesc>{t.createRequest.reverse}</FactoringTypeDesc>
                  </FactoringTypeCard>
                  <FactoringTypeCard
                    $selected={factoringType === 'closed'}
                    onClick={() => setFactoringType('closed')}
                  >
                    <FactoringTypeTitle>{t.createRequest.closed}</FactoringTypeTitle>
                    <FactoringTypeDesc>{t.createRequest.closed}</FactoringTypeDesc>
                  </FactoringTypeCard>
                </ChoiceGrid>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <FormLabel style={{ display: 'block', marginBottom: '0.75rem' }}>{t.createRequest.recourseTypeLabel}</FormLabel>
                <ChoiceGrid>
                  <ChoiceButton
                    $selected={recourseType === 'recourse'}
                    onClick={() => setRecourseType('recourse')}
                  >
                    {t.createRequest.recourse}
                  </ChoiceButton>
                  <ChoiceButton
                    $selected={recourseType === 'non-recourse'}
                    onClick={() => setRecourseType('non-recourse')}
                  >
                    {t.createRequest.nonRecourse}
                  </ChoiceButton>
                </ChoiceGrid>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '2rem 0 1rem 0', color: '#111827' }}>{t.createRequest.calculator}</h4>
              <TwoColGrid>
                <FormGroup>
                  <FormLabel>{t.createRequest.financingPercentLabel}</FormLabel>
                  <FormInput
                    type="number"
                    value={financingPercent}
                    onChange={(e) => setFinancingPercent(Number(e.target.value))}
                    min="50"
                    max="100"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>{t.createRequest.interestRateLabel}</FormLabel>
                  <FormInput
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </FormGroup>
              </TwoColGrid>

              <FormGroup>
                <FormLabel>{t.createRequest.commissionRateLabel}</FormLabel>
                <FormInput
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  step="0.1"
                />
              </FormGroup>

              <CalcCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <TrendingUp size={18} color="#2563eb" />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2563eb' }}>{t.createRequest.calculator}</span>
                </div>
                <CalcRow>
                  <span>{t.createRequest.totalInvoices}:</span>
                  <span style={{ fontWeight: 600 }}>₴ {totalAmount.toLocaleString()}</span>
                </CalcRow>
                <CalcRow>
                  <span>{t.createRequest.availableFinancing} ({financingPercent}%):</span>
                  <span style={{ fontWeight: 600 }}>₴ {financingAmount.toLocaleString()}</span>
                </CalcRow>
                <CalcRow>
                  <span>{t.createRequest.administrationFee} ({commissionRate}%):</span>
                  <span>₴ {commissionAmount.toLocaleString()}</span>
                </CalcRow>
                <CalcRow>
                  <span>{t.createRequest.monthlyInterest} ({interestRate}%):</span>
                  <span>₴ {Math.round(monthInterest).toLocaleString()}</span>
                </CalcRow>
                <CalcRow $bold>
                  <span>{t.createRequest.firstTranche}:</span>
                  <span>₴ {(financingAmount - commissionAmount).toLocaleString()}</span>
                </CalcRow>
              </CalcCard>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>{t.createRequest.step4Title}</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                {t.createRequest.step4Desc}
              </p>

              <SummarySection>
                <SummaryTitle>{t.createRequest.selectedDocuments}</SummaryTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedDocIds.map(docId => {
                    const doc = MOCK_DOCUMENTS.find(d => d.id === docId);
                    return doc ? (
                      <div key={docId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span>• {doc.name}</span>
                        <span style={{ fontWeight: 600 }}>
                          ₴ {docAmounts[docId]?.toLocaleString()} / {doc.amount.toLocaleString()}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </SummarySection>

              <SummarySection>
                <SummaryTitle>{t.createRequest.counterparties}</SummaryTitle>
                <SummaryGrid>
                  <SummaryLabel>{t.requests.debtor}:</SummaryLabel>
                  <SummaryValue>{debtorName}</SummaryValue>
                  <SummaryLabel>{t.companies.edrpou}:</SummaryLabel>
                  <SummaryValue>{debtorEdrpou}</SummaryValue>
                  <SummaryLabel>{t.requests.paymentDate}:</SummaryLabel>
                  <SummaryValue>{paymentDate}</SummaryValue>
                </SummaryGrid>
              </SummarySection>

              <SummarySection>
                <SummaryTitle>{t.createRequest.factoringParams}</SummaryTitle>
                <SummaryGrid>
                  <SummaryLabel>{t.createRequest.factoringTypeLabel}:</SummaryLabel>
                  <SummaryValue>{getTypeNameCapital(factoringType)}</SummaryValue>
                  <SummaryLabel>{t.createRequest.recourseTypeLabel}:</SummaryLabel>
                  <SummaryValue>{getSubtypeNameCapital(recourseType)}</SummaryValue>
                  <SummaryLabel>{t.createRequest.financingPercentLabel}:</SummaryLabel>
                  <SummaryValue>{financingPercent}%</SummaryValue>
                  <SummaryLabel>{t.createRequest.interestRateLabel}:</SummaryLabel>
                  <SummaryValue>{interestRate}%</SummaryValue>
                  <SummaryLabel>{t.createRequest.commissionRateLabel}:</SummaryLabel>
                  <SummaryValue>{commissionRate}%</SummaryValue>
                </SummaryGrid>
              </SummarySection>

              <SummarySection>
                <SummaryTitle>{t.createRequest.expectedPayout}</SummaryTitle>
                <CalcCard style={{ margin: 0, backgroundColor: '#f1f5f9' }}>
                  <CalcRow>
                    <span>{t.createRequest.financing}:</span>
                    <span style={{ fontWeight: 600 }}>₴ {financingAmount.toLocaleString()}</span>
                  </CalcRow>
                  <CalcRow>
                    <span>{t.createRequest.factorFees}:</span>
                    <span>₴ {commissionAmount.toLocaleString()}</span>
                  </CalcRow>
                  <CalcRow $bold>
                    <span>{t.createRequest.totalPayout}:</span>
                    <span>₴ {(financingAmount - commissionAmount).toLocaleString()}</span>
                  </CalcRow>
                </CalcCard>
              </SummarySection>
            </div>
          )}
        </FormBody>

        <FormFooter>
          {currentStep > 1 ? (
            <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>
              {t.common.back}
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              disabled={currentStep === 1 && selectedDocIds.length === 0}
              icon={<ArrowRight size={16} />}
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              {t.createRequest.continue}
            </Button>
          ) : (
            <Button icon={<Save size={16} />} onClick={handleSubmit} disabled={loading}>
              {loading ? t.common.loading : t.createRequest.confirm}
            </Button>
          )}
        </FormFooter>
      </FormContainer>
    </Layout>
  );
};
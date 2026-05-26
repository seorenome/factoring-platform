import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
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
import { FileText, ArrowLeft, ArrowRight, Save, ClipboardList, TrendingUp } from 'lucide-react';

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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Document selection states
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [docAmounts, setDocAmounts] = useState<Record<string, number>>({});
  const [partialUse, setPartialUse] = useState<Record<string, boolean>>({});

  // Step 2: Debtor states
  const [debtorName, setDebtorName] = useState('');
  const [debtorEdrpou, setDebtorEdrpou] = useState('');
  const [paymentDate, setPaymentDate] = useState('25.07.2026'); // Target payment date

  // Step 3: Financing & Calculator parameters
  const [factoringType, setFactoringType] = useState<'classical' | 'reverse' | 'closed'>('classical');
  const [recourseType, setRecourseType] = useState<'recourse' | 'non-recourse'>('recourse');
  const [financingPercent, setFinancingPercent] = useState(80);
  const [interestRate, setInterestRate] = useState(18); // %
  const [commissionRate, setCommissionRate] = useState(1.5); // %

  // Populate debtor information automatically when documents are chosen
  useEffect(() => {
    if (selectedDocIds.length > 0) {
      const firstSelectedDoc = MOCK_DOCUMENTS.find(doc => doc.id === selectedDocIds[0]);
      if (firstSelectedDoc) {
        setDebtorName(firstSelectedDoc.debtor);
        setDebtorEdrpou(firstSelectedDoc.debtorEdrpou);
      }
    }
  }, [selectedDocIds]);

  // Initializing custom amounts when selecting documents
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

  // Math conversions
  const calculateTotalAmount = () => {
    return selectedDocIds.reduce((sum, docId) => sum + (docAmounts[docId] || 0), 0);
  };

  const totalAmount = calculateTotalAmount();
  const financingAmount = (totalAmount * financingPercent) / 100;
  const commissionAmount = (totalAmount * commissionRate) / 100;
  const yearlyInterest = (financingAmount * interestRate) / 100;
  const monthInterest = yearlyInterest / 12; // Estimation for 30 days

  // Saving request to localStorage and appending to active requests
  const handleSubmit = () => {
    // Determine Supplier
    let supplierName = 'ТОВ "Постач-Пром"';
    if (selectedDocIds.length > 0) {
      const firstDoc = MOCK_DOCUMENTS.find(doc => doc.id === selectedDocIds[0]);
      if (firstDoc) {
        supplierName = firstDoc.supplier;
      }
    }

    const newRequest = {
      id: `REQ-00${Math.floor(Math.random() * 900) + 100}`,
      date: new Date().toISOString().slice(0, 10),
      supplier: supplierName,
      debtor: debtorName || 'ТОВ "Новий Дебітор"',
      amount: totalAmount,
      status: 'pending' as const
    };

    // Retrieve, append, and save
    const currentList = localStorage.getItem('factoring_requests');
    let list = [];
    if (currentList) {
      try {
        list = JSON.parse(currentList);
      } catch (e) {
        console.error(e);
      }
    } else {
      // populate with matching mocks
      list = [
        { id: 'REQ-001', date: '2026-05-08', supplier: 'ТОВ "Постач-Пром"', debtor: 'ТОВ "Рітейл Груп"', amount: 250000, status: 'pending' },
        { id: 'REQ-002', date: '2026-05-07', supplier: 'ФОП Коваленко', debtor: 'ТОВ "Еко-Маркет"', amount: 120000, status: 'approved' },
        { id: 'REQ-003', date: '2026-05-05', supplier: 'ТОВ "Західбуд"', debtor: 'ПрАТ "Київміськбуд"', amount: 840000, status: 'rejected' },
        { id: 'REQ-004', date: '2026-05-08', supplier: 'ТОВ "Торг-Майстер"', debtor: 'ТОВ "Агроінвест"', amount: 45000, status: 'draft' }
      ];
    }

    list.unshift(newRequest);
    localStorage.setItem('factoring_requests', JSON.stringify(list));

    // Redirect to Requests Log page
    navigate('/requests');
  };

  // Label helpers
  const getTypeNameCapital = (type: string) => {
    if (type === 'classical') return 'Класичний';
    if (type === 'reverse') return 'Реверсивний';
    return 'Закритий';
  };

  const getSubtypeNameCapital = (type: string) => {
    return type === 'recourse' ? 'З регресом' : 'Без регресу';
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
          <ArrowLeft size={16} /> Повернутися до заявок
        </button>
      </div>

      <DashboardHeader style={{ marginBottom: '2rem' }}>
        <Title>Створення нової заявки</Title>
      </DashboardHeader>

      <FormContainer>
        <FormHeader>
          <StepsProgress>
            <StepIndicator $active={currentStep === 1} $completed={currentStep > 1}>
              <StepDot $active={currentStep === 1} $completed={currentStep > 1}>1</StepDot>
              <StepLabel $active={currentStep === 1}>Документи</StepLabel>
            </StepIndicator>
            <StepIndicator $active={currentStep === 2} $completed={currentStep > 2}>
              <StepDot $active={currentStep === 2} $completed={currentStep > 2}>2</StepDot>
              <StepLabel $active={currentStep === 2}>Дебітор</StepLabel>
            </StepIndicator>
            <StepIndicator $active={currentStep === 3} $completed={currentStep > 3}>
              <StepDot $active={currentStep === 3} $completed={currentStep > 3}>3</StepDot>
              <StepLabel $active={currentStep === 3}>Калькулятор</StepLabel>
            </StepIndicator>
            <StepIndicator $active={currentStep === 4} $completed={currentStep > 4}>
              <StepDot $active={currentStep === 4} $completed={currentStep > 4}>4</StepDot>
              <StepLabel $active={currentStep === 4}>Підтвердження</StepLabel>
            </StepIndicator>
          </StepsProgress>
        </FormHeader>

        <FormBody>
          {/* STEP 1: Select documents */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Крок 1: Виберіть документи для факторингу</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                Позначте акти або рахунки, які ви бажаєте профінансувати. Можна використати суму документа повністю або вказати часткове використання.
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
                              Постачальник: {doc.supplier} • Дебітор: {doc.debtor}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                            ₴ {doc.amount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>Повна сума</div>
                        </div>
                      </div>

                      {/* Partial Use Actions */}
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
                            Часткове використання (п. 2.4 ТЗ)
                          </label>

                          {isPartial && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Сума використання:</span>
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

          {/* STEP 2: Debtor details */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Крок 2: Інформація про дебітора та платіж</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                Реквізити автоматично аналізуються на основі завантаженого пакету документів. Деталі можна за потреби змінити.
              </p>

              <FormGroup>
                <FormLabel>Назва компанії-дебітора</FormLabel>
                <FormInput
                  type="text"
                  value={debtorName}
                  onChange={(e) => setDebtorName(e.target.value)}
                  placeholder="Введіть назву юридичної особи"
                />
              </FormGroup>

              <TwoColGrid>
                <FormGroup>
                  <FormLabel>Код ЄДРПОУ дебітора</FormLabel>
                  <FormInput
                    type="text"
                    value={debtorEdrpou}
                    onChange={(e) => setDebtorEdrpou(e.target.value)}
                    placeholder="8-значний цифровий код"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Дата платежу за договором</FormLabel>
                  <FormInput
                    type="text"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    placeholder="ДД.ММ.РРРР"
                  />
                </FormGroup>
              </TwoColGrid>
            </div>
          )}

          {/* STEP 3: Parameters & Calculator */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Крок 3: Вибір типу та Калькулятор фінансування</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <FormLabel style={{ display: 'block', marginBottom: '0.75rem' }}>Тип факторингу (п. 2.2 ТЗ)</FormLabel>
                <ChoiceGrid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <FactoringTypeCard
                    $selected={factoringType === 'classical'}
                    onClick={() => setFactoringType('classical')}
                  >
                    <FactoringTypeTitle>Класичний</FactoringTypeTitle>
                    <FactoringTypeDesc>Фінансування постачальника під заставу відступлених грошових вимог до дебітора.</FactoringTypeDesc>
                  </FactoringTypeCard>
                  <FactoringTypeCard
                    $selected={factoringType === 'reverse'}
                    onClick={() => setFactoringType('reverse')}
                  >
                    <FactoringTypeTitle>Реверсивний</FactoringTypeTitle>
                    <FactoringTypeDesc>Ініціюється дебітором для забезпечення відстрочки з оплати рахунків постачальникам.</FactoringTypeDesc>
                  </FactoringTypeCard>
                  <FactoringTypeCard
                    $selected={factoringType === 'closed'}
                    onClick={() => setFactoringType('closed')}
                  >
                    <FactoringTypeTitle>Закритий</FactoringTypeTitle>
                    <FactoringTypeDesc>Дебітор не повідомляється про наявність договору відступлення права вимоги.</FactoringTypeDesc>
                  </FactoringTypeCard>
                </ChoiceGrid>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <FormLabel style={{ display: 'block', marginBottom: '0.75rem' }}>Вибір підтипу (п. 2.2.1 ТЗ)</FormLabel>
                <ChoiceGrid>
                  <ChoiceButton
                    $selected={recourseType === 'recourse'}
                    onClick={() => setRecourseType('recourse')}
                  >
                    З регресом (Зобов'язання повернення при несплаті)
                  </ChoiceButton>
                  <ChoiceButton
                    $selected={recourseType === 'non-recourse'}
                    onClick={() => setRecourseType('non-recourse')}
                  >
                    Без регресу (Фактор бере кредитний ризик)
                  </ChoiceButton>
                </ChoiceGrid>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '2rem 0 1rem 0', color: '#111827' }}>Калькулятор умов</h4>
              <TwoColGrid>
                <FormGroup>
                  <FormLabel>Відсоток першого траншу (%)</FormLabel>
                  <FormInput
                    type="number"
                    value={financingPercent}
                    onChange={(e) => setFinancingPercent(Number(e.target.value))}
                    min="50"
                    max="100"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Ставка дисконту (% річних)</FormLabel>
                  <FormInput
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </FormGroup>
              </TwoColGrid>

              <FormGroup>
                <FormLabel>Збір фактора / Комісія (%)</FormLabel>
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
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#2563eb' }}>Онлайн-калькулятор (п. 3.3.1.5)</span>
                </div>
                <CalcRow>
                  <span>Загальна сума інвойсів:</span>
                  <span style={{ fontWeight: 600 }}>₴ {totalAmount.toLocaleString()}</span>
                </CalcRow>
                <CalcRow>
                  <span>Доступне фінансування ({financingPercent}%):</span>
                  <span style={{ fontWeight: 600 }}>₴ {financingAmount.toLocaleString()}</span>
                </CalcRow>
                <CalcRow>
                  <span>Комісія за адміністрування ({commissionRate}%):</span>
                  <span>₴ {commissionAmount.toLocaleString()}</span>
                </CalcRow>
                <CalcRow>
                  <span>Орієнтовні відсотки на місяць ({interestRate}% річних):</span>
                  <span>₴ {Math.round(monthInterest).toLocaleString()}</span>
                </CalcRow>
                <CalcRow $bold>
                  <span>Сума виплати першого траншу:</span>
                  <span>₴ {(financingAmount - commissionAmount).toLocaleString()}</span>
                </CalcRow>
              </CalcCard>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Крок 4: Перевірка та завершення</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                Будь ласка, перевірте правильність заповнених параметрів заявки перед відправкою.
              </p>

              <SummarySection>
                <SummaryTitle>Залучені документи</SummaryTitle>
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
                <SummaryTitle>Контрагенти та Сроки</SummaryTitle>
                <SummaryGrid>
                  <SummaryLabel>Дебітор:</SummaryLabel>
                  <SummaryValue>{debtorName}</SummaryValue>
                  <SummaryLabel>Код ЄДРПОУ:</SummaryLabel>
                  <SummaryValue>{debtorEdrpou}</SummaryValue>
                  <SummaryLabel>Дата платежу:</SummaryLabel>
                  <SummaryValue>{paymentDate}</SummaryValue>
                </SummaryGrid>
              </SummarySection>

              <SummarySection>
                <SummaryTitle>Параметри факторингу</SummaryTitle>
                <SummaryGrid>
                  <SummaryLabel>Тип:</SummaryLabel>
                  <SummaryValue>{getTypeNameCapital(factoringType)}</SummaryValue>
                  <SummaryLabel>Підтип:</SummaryLabel>
                  <SummaryValue>{getSubtypeNameCapital(recourseType)}</SummaryValue>
                  <SummaryLabel>Відсоток:</SummaryLabel>
                  <SummaryValue>{financingPercent}%</SummaryValue>
                  <SummaryLabel>Річна ставка:</SummaryLabel>
                  <SummaryValue>{interestRate}%</SummaryValue>
                  <SummaryLabel>Комісія:</SummaryLabel>
                  <SummaryValue>{commissionRate}%</SummaryValue>
                </SummaryGrid>
              </SummarySection>

              <SummarySection>
                <SummaryTitle>Очікувані показники виплати</SummaryTitle>
                <CalcCard style={{ margin: 0, backgroundColor: '#f1f5f9' }}>
                  <CalcRow>
                    <span>Фінансування:</span>
                    <span style={{ fontWeight: 600 }}>₴ {financingAmount.toLocaleString()}</span>
                  </CalcRow>
                  <CalcRow>
                    <span>Збори фактора:</span>
                    <span>₴ {commissionAmount.toLocaleString()}</span>
                  </CalcRow>
                  <CalcRow $bold>
                    <span>Загальний транш до виплати:</span>
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
              Назад
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
              Продовжити
            </Button>
          ) : (
            <Button icon={<Save size={16} />} onClick={handleSubmit}>
              Підтвердити та відправити
            </Button>
          )}
        </FormFooter>
      </FormContainer>
    </Layout>
  );
};

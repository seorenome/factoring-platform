import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import { api, Request } from '../../services/api';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { 
  DetailsContainer, MainPanel, SidebarPanel, SectionCard, SectionTitle, 
  DataGrid, DataItem, DataLabel, DataValue, Timeline, TimelineItem, 
  TimelineDot, TimelineContent, InputGroup, Label, Input, ButtonGroup 
} from './RequestDetails.styled';
import { Badge } from '../Requests/Requests.styled';
import { Check, ArrowLeft, FileText, Download, Loader2 } from 'lucide-react';

export const RequestDetails: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [financingPercent, setFinancingPercent] = useState(80);
  const [interestRate, setInterestRate] = useState(18);
  const [commissionRate, setCommissionRate] = useState(1.5);

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const requests = await api.getRequests();
      const found = requests.find(r => r.id === Number(id));
      setRequest(found || null);
    } catch (error) {
      console.error('Failed to load request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge $status="pending">{t.requests.pending}</Badge>;
      case 'approved': return <Badge $status="approved">{t.requests.approved}</Badge>;
      case 'rejected': return <Badge $status="rejected">{t.requests.rejected}</Badge>;
      default: return <Badge $status="draft">{status}</Badge>;
    }
  };

  const getFactoringTypeText = (type: string) => {
    switch(type) {
      case 'classical': return t.createRequest.classical;
      case 'reverse': return t.createRequest.reverse;
      case 'closed': return t.createRequest.closed;
      default: return type;
    }
  };

  const getRecourseTypeText = (type: string) => {
    switch(type) {
      case 'recourse': return t.createRequest.recourse;
      case 'non-recourse': return t.createRequest.nonRecourse;
      default: return type;
    }
  };

  const handleApprove = async () => {
    if (!request) return;
    try {
      await api.approveRequest(request.id, request.financingAmount);
      await loadRequest();
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  // Функція для визначення активного статусу в таймлайні
  const getTimelineStatus = () => {
    if (!request) return 0;
    switch (request.status) {
      case 'pending':
        return 2; // Рішення фактора (активний)
      case 'approved':
        return 3; // Підписання (пройдено)
      case 'rejected':
        return 0; // Відхилено
      default:
        return 0;
    }
  };

  const timelineStatus = getTimelineStatus();

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader2 size={32} className="animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>{t.common.noData}</p>
          <Button onClick={() => navigate('/requests')}>{t.common.back}</Button>
        </div>
      </Layout>
    );
  }

  const financingAmount = (request.amount * financingPercent) / 100;
  const commissionAmount = (request.amount * commissionRate) / 100;

  // Форматування дати для таймлайну
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Layout>
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate('/requests')}
          style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> {t.common.back}
        </button>
      </div>

      <DashboardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Title>{t.requests.details} {request.requestNumber}</Title>
          {getStatusBadge(request.status)}
        </div>
        {user?.role === 'factor' && request.status === 'pending' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary">{t.common.reject}</Button>
            <Button onClick={handleApprove}>{t.common.approve}</Button>
          </div>
        )}
      </DashboardHeader>

      <DetailsContainer>
        <MainPanel>
          <SectionCard>
            <SectionTitle>{t.requests.details}</SectionTitle>
            <DataGrid>
              <DataItem>
                <DataLabel>{t.requests.supplier}</DataLabel>
                <DataValue>{request.supplierName}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.requests.debtor}</DataLabel>
                <DataValue>{request.debtorName} ({t.companies.edrpou}: {request.debtorEdrpou})</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.dashboard.totalFinanced}</DataLabel>
                <DataValue>₴ {request.amount.toLocaleString()}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.requests.financingPercent}</DataLabel>
                <DataValue>₴ {request.financingAmount.toLocaleString()}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.requests.factoringType}</DataLabel>
                <DataValue>{getFactoringTypeText(request.factoringType)}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.requests.recourseType}</DataLabel>
                <DataValue>{getRecourseTypeText(request.recourseType)}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.requests.paymentDate}</DataLabel>
                <DataValue>{request.paymentDate || t.common.noData}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>{t.requests.createdAt}</DataLabel>
                <DataValue>{formatDate(request.createdAt)}</DataValue>
              </DataItem>
            </DataGrid>
          </SectionCard>

          <SectionCard>
            <SectionTitle>{t.requests.documents}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e5e5', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FileText color="#6b7280" />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Рахунок-фактура №{request.requestNumber}.pdf</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{t.common.loading} {formatDate(request.createdAt).split(',')[0]}</div>
                  </div>
                </div>
                <Button variant="outline" icon={<Download size={16} />}>{t.common.download}</Button>
              </div>
            </div>
          </SectionCard>
        </MainPanel>

        <SidebarPanel>
          {user?.role === 'factor' && request.status === 'pending' && (
            <SectionCard>
              <SectionTitle>{t.requests.decision}</SectionTitle>
              
              <InputGroup>
                <Label>{t.requests.financingPercent}</Label>
                <Input type="number" value={financingPercent} onChange={(e) => setFinancingPercent(Number(e.target.value))} />
              </InputGroup>
              
              <InputGroup>
                <Label>{t.requests.discountRate}</Label>
                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
              </InputGroup>
              
              <InputGroup>
                <Label>{t.requests.commission}</Label>
                <Input type="number" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} />
              </InputGroup>
              
              <InputGroup>
                <Label>{t.requests.payoutAmount}</Label>
                <Input type="text" value={`₴ ${(financingAmount - commissionAmount).toLocaleString()}`} readOnly style={{ backgroundColor: '#f9fafb' }} />
              </InputGroup>

              <ButtonGroup>
                <Button style={{ width: '100%' }} onClick={handleApprove}>{t.common.approve}</Button>
              </ButtonGroup>
            </SectionCard>
          )}

          <SectionCard>
            <SectionTitle>Статус процесу</SectionTitle>
            <Timeline>
              {/* Етап 1: Заявка створена */}
              <TimelineItem $active={timelineStatus >= 0}>
                <TimelineDot $completed={timelineStatus >= 0} $active={timelineStatus === 0}>
                  {timelineStatus >= 0 && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ color: timelineStatus >= 0 ? '#111827' : '#9ca3af' }}>
                    Заявка створена
                  </DataValue>
                  <DataLabel style={{ display: 'block', color: '#6b7280' }}>
                    {formatDate(request.createdAt)}
                  </DataLabel>
                </TimelineContent>
              </TimelineItem>

              {/* Етап 2: KYC/AML перевірка */}
              <TimelineItem $active={timelineStatus >= 1}>
                <TimelineDot $completed={timelineStatus >= 1} $active={timelineStatus === 1}>
                  {timelineStatus >= 1 && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ color: timelineStatus >= 1 ? '#111827' : '#9ca3af' }}>
                    KYC/AML перевірка
                  </DataValue>
                  {timelineStatus >= 1 && (
                    <DataLabel style={{ display: 'block', color: '#6b7280' }}>
                      {formatDate(request.createdAt)}
                    </DataLabel>
                  )}
                  {timelineStatus < 1 && (
                    <DataLabel style={{ display: 'block', color: '#9ca3af' }}>
                      Очікує перевірку
                    </DataLabel>
                  )}
                </TimelineContent>
              </TimelineItem>

              {/* Етап 3: Рішення фактора */}
              <TimelineItem $active={timelineStatus >= 2}>
                <TimelineDot $completed={timelineStatus >= 2} $active={timelineStatus === 2}>
                  {timelineStatus >= 2 && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ 
                    color: timelineStatus >= 2 ? '#111827' : (timelineStatus === 1 ? '#2563eb' : '#9ca3af')
                  }}>
                    Рішення фактора
                  </DataValue>
                  {timelineStatus === 1 && (
                    <DataLabel style={{ display: 'block', color: '#f59e0b' }}>
                      Очікує на встановлення умов
                    </DataLabel>
                  )}
                  {timelineStatus >= 2 && (
                    <DataLabel style={{ display: 'block', color: '#6b7280' }}>
                      {request.status === 'approved' ? 'Схвалено' : 'Оброблено'}
                    </DataLabel>
                  )}
                  {timelineStatus < 1 && (
                    <DataLabel style={{ display: 'block', color: '#9ca3af' }}>
                      Очікує розгляду
                    </DataLabel>
                  )}
                </TimelineContent>
              </TimelineItem>

              {/* Етап 4: Підписання документів (КЕП) */}
              <TimelineItem $active={timelineStatus >= 3}>
                <TimelineDot $completed={timelineStatus >= 3} $active={timelineStatus === 3}>
                  {timelineStatus >= 3 && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ color: timelineStatus >= 3 ? '#111827' : '#9ca3af' }}>
                    Підписання документів (КЕП)
                  </DataValue>
                  {timelineStatus < 3 && timelineStatus >= 2 && (
                    <DataLabel style={{ display: 'block', color: '#9ca3af' }}>
                      Очікує підписання
                    </DataLabel>
                  )}
                </TimelineContent>
              </TimelineItem>

              {/* Етап 5: Виплата фінансування */}
              <TimelineItem $active={timelineStatus >= 4}>
                <TimelineDot $completed={timelineStatus >= 4} $active={timelineStatus === 4}>
                  {timelineStatus >= 4 && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ color: timelineStatus >= 4 ? '#111827' : '#9ca3af' }}>
                    Виплата фінансування
                  </DataValue>
                  {timelineStatus >= 3 && timelineStatus < 4 && (
                    <DataLabel style={{ display: 'block', color: '#9ca3af' }}>
                      Очікує виплату
                    </DataLabel>
                  )}
                </TimelineContent>
              </TimelineItem>

              {/* Етап 6: Погашення */}
              <TimelineItem $active={timelineStatus >= 5}>
                <TimelineDot $completed={timelineStatus >= 5} $active={timelineStatus === 5}>
                  {timelineStatus >= 5 && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ color: timelineStatus >= 5 ? '#111827' : '#9ca3af' }}>
                    Погашення заборгованості
                  </DataValue>
                  {timelineStatus >= 4 && timelineStatus < 5 && (
                    <DataLabel style={{ display: 'block', color: '#9ca3af' }}>
                      Очікує оплату дебітора
                    </DataLabel>
                  )}
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </SectionCard>
        </SidebarPanel>
      </DetailsContainer>
    </Layout>
  );
};
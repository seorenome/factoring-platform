import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      case 'pending': return <Badge $status="pending">На розгляді</Badge>;
      case 'approved': return <Badge $status="approved">Схвалено</Badge>;
      case 'rejected': return <Badge $status="rejected">Відхилено</Badge>;
      default: return <Badge $status="draft">{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'На розгляді';
      case 'approved': return 'Схвалено';
      case 'rejected': return 'Відхилено';
      default: return status;
    }
  };

  const getFactoringTypeText = (type: string) => {
    switch(type) {
      case 'classical': return 'Класичний';
      case 'reverse': return 'Реверсивний';
      case 'closed': return 'Закритий';
      default: return type;
    }
  };

  const getRecourseTypeText = (type: string) => {
    switch(type) {
      case 'recourse': return 'З регресом';
      case 'non-recourse': return 'Без регресу';
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
          <p>Заявку не знайдено</p>
          <Button onClick={() => navigate('/requests')}>Повернутися</Button>
        </div>
      </Layout>
    );
  }

  const financingAmount = (request.amount * financingPercent) / 100;
  const commissionAmount = (request.amount * commissionRate) / 100;

  return (
    <Layout>
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate('/requests')}
          style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> Повернутися до списку
        </button>
      </div>

      <DashboardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Title>Заявка {request.requestNumber}</Title>
          {getStatusBadge(request.status)}
        </div>
        {user?.role === 'factor' && request.status === 'pending' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary">Відхилити</Button>
            <Button onClick={handleApprove}>Схвалити фінансування</Button>
          </div>
        )}
      </DashboardHeader>

      <DetailsContainer>
        <MainPanel>
          <SectionCard>
            <SectionTitle>Інформація про заявку</SectionTitle>
            <DataGrid>
              <DataItem>
                <DataLabel>Постачальник</DataLabel>
                <DataValue>{request.supplierName}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Дебітор</DataLabel>
                <DataValue>{request.debtorName} (ЄДРПОУ: {request.debtorEdrpou})</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Сума інвойсів</DataLabel>
                <DataValue>₴ {request.amount.toLocaleString()}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Сума фінансування</DataLabel>
                <DataValue>₴ {request.financingAmount.toLocaleString()}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Тип факторингу</DataLabel>
                <DataValue>{getFactoringTypeText(request.factoringType)}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Регрес</DataLabel>
                <DataValue>{getRecourseTypeText(request.recourseType)}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Дата платежу</DataLabel>
                <DataValue>{request.paymentDate || 'Не вказано'}</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Дата створення</DataLabel>
                <DataValue>{new Date(request.createdAt).toLocaleString()}</DataValue>
              </DataItem>
            </DataGrid>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Документи</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e5e5', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FileText color="#6b7280" />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Рахунок-фактура №{request.requestNumber}.pdf</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Завантажено: {new Date(request.createdAt).toLocaleDateString()} • 2.4 MB</div>
                  </div>
                </div>
                <Button variant="outline" icon={<Download size={16} />}>Завантажити</Button>
              </div>
            </div>
          </SectionCard>
        </MainPanel>

        <SidebarPanel>
          {user?.role === 'factor' && request.status === 'pending' && (
            <SectionCard>
              <SectionTitle>Рішення та умови (Фактор)</SectionTitle>
              
              <InputGroup>
                <Label>Відсоток фінансування (%)</Label>
                <Input type="number" value={financingPercent} onChange={(e) => setFinancingPercent(Number(e.target.value))} />
              </InputGroup>
              
              <InputGroup>
                <Label>Ставка / Дисконт (% річних)</Label>
                <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
              </InputGroup>
              
              <InputGroup>
                <Label>Комісія фактора (%)</Label>
                <Input type="number" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} />
              </InputGroup>
              
              <InputGroup>
                <Label>Сума до виплати постачальнику</Label>
                <Input type="text" value={`₴ ${(financingAmount - commissionAmount).toLocaleString()}`} readOnly style={{ backgroundColor: '#f9fafb' }} />
              </InputGroup>

              <ButtonGroup>
                <Button style={{ width: '100%' }} onClick={handleApprove}>Схвалити</Button>
              </ButtonGroup>
            </SectionCard>
          )}

          <SectionCard>
            <SectionTitle>Статус процесу</SectionTitle>
            <Timeline>
              <TimelineItem $active>
                <TimelineDot $completed>
                  <Check size={14} color="white" />
                </TimelineDot>
                <TimelineContent>
                  <DataValue>Заявка створена</DataValue>
                  <DataLabel style={{ display: 'block' }}>{new Date(request.createdAt).toLocaleString()}</DataLabel>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem $active={request.status === 'approved'}>
                <TimelineDot $completed={request.status === 'approved'} $active={request.status === 'pending'}>
                  {request.status === 'approved' && <Check size={14} color="white" />}
                </TimelineDot>
                <TimelineContent>
                  <DataValue style={{ color: request.status === 'approved' ? '#111827' : '#9ca3af' }}>
                    {request.status === 'approved' ? 'Схвалено' : 'Рішення фактора'}
                  </DataValue>
                  {request.status === 'pending' && (
                    <DataLabel style={{ display: 'block' }}>Очікує на розгляд</DataLabel>
                  )}
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineDot />
                <TimelineContent>
                  <DataValue style={{ color: '#9ca3af' }}>Підписання документів (КЕП)</DataValue>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem>
                <TimelineDot />
                <TimelineContent>
                  <DataValue style={{ color: '#9ca3af' }}>Виплата фінансування</DataValue>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </SectionCard>
        </SidebarPanel>
      </DetailsContainer>
    </Layout>
  );
};
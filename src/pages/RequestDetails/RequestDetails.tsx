import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Layout } from '../../components/Layout/Layout';
import { DashboardHeader, Title } from '../Dashboard/Dashboard.styled';
import { Button } from '../../components/Button/Button';
import { 
  DetailsContainer, MainPanel, SidebarPanel, SectionCard, SectionTitle, 
  DataGrid, DataItem, DataLabel, DataValue, Timeline, TimelineItem, 
  TimelineDot, TimelineContent, InputGroup, Label, Input, ButtonGroup 
} from './RequestDetails.styled';
import { Badge } from '../Requests/Requests.styled';
import { Check, ArrowLeft, FileText, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const RequestDetails: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams();

  const requestId = id || 'REQ-001';

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
          <Title>Заявка {requestId}</Title>
          <Badge $status="pending">На розгляді</Badge>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline">Запросити додаткові дані</Button>
          <Button variant="secondary">Відхилити</Button>
          <Button>Схвалити фінансування</Button>
        </div>
      </DashboardHeader>

      <DetailsContainer>
        <MainPanel>
          <SectionCard>
            <SectionTitle>Інформація про заявку</SectionTitle>
            <DataGrid>
              <DataItem>
                <DataLabel>Постачальник</DataLabel>
                <DataValue>ТОВ "Постач-Пром" (ЄДРПОУ: 12345678)</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Дебітор</DataLabel>
                <DataValue>ТОВ "Рітейл Груп" (ЄДРПОУ: 87654321)</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Загальна сума інвойсів</DataLabel>
                <DataValue>₴ 250,000.00</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Бажаний строк фінансування</DataLabel>
                <DataValue>60 днів</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Тип факторингу</DataLabel>
                <DataValue>З регресом</DataValue>
              </DataItem>
              <DataItem>
                <DataLabel>Дата створення</DataLabel>
                <DataValue>08 Травня 2026, 14:30</DataValue>
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
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Рахунок-фактура №142.pdf</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Завантажено: 08.05.2026 • 2.4 MB</div>
                  </div>
                </div>
                <Button variant="outline" icon={<Download size={16} />}>Завантажити</Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e5e5', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FileText color="#6b7280" />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Видаткова_накладна_ВН-88.pdf</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Завантажено: 08.05.2026 • 1.1 MB</div>
                  </div>
                </div>
                <Button variant="outline" icon={<Download size={16} />}>Завантажити</Button>
              </div>
            </div>
          </SectionCard>
        </MainPanel>

        <SidebarPanel>
          <SectionCard>
            <SectionTitle>Рішення та умови (Фактор)</SectionTitle>
            
            <InputGroup>
              <Label>Відсоток фінансування (%)</Label>
              <Input type="number" defaultValue={80} />
            </InputGroup>
            
            <InputGroup>
              <Label>Ставка / Дисконт (% річних)</Label>
              <Input type="number" defaultValue={18} />
            </InputGroup>
            
            <InputGroup>
              <Label>Сума до виплати постачальнику</Label>
              <Input type="text" value="₴ 200,000.00" readOnly style={{ backgroundColor: '#f9fafb' }} />
            </InputGroup>

            <ButtonGroup>
              <Button style={{ width: '100%' }}>Зберегти умови</Button>
            </ButtonGroup>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Статус процесу</SectionTitle>
            <Timeline>
              <TimelineItem $active>
                <TimelineDot $completed>
                  <Check size={14} color="white" />
                </TimelineDot>
                <TimelineContent>
                  <DataValue>Заявка створена</DataValue>
                  <DataLabel style={{ display: 'block' }}>08.05.2026 14:30</DataLabel>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem $active>
                <TimelineDot $completed>
                  <Check size={14} color="white" />
                </TimelineDot>
                <TimelineContent>
                  <DataValue>KYC/AML перевірка пройдена</DataValue>
                  <DataLabel style={{ display: 'block' }}>08.05.2026 15:15</DataLabel>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem $active>
                <TimelineDot $active />
                <TimelineContent>
                  <DataValue style={{ color: '#2563eb' }}>Рішення фактора</DataValue>
                  <DataLabel style={{ display: 'block' }}>Очікує на встановлення умов</DataLabel>
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

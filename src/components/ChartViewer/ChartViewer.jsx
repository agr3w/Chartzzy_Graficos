import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './ChartViewer.module.css';

const MOCK_DATA = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  sales: [120, 200, 150, 80, 270, 310],
  targets: [100, 180, 160, 100, 240, 280],
};

export default function ChartViewer() {
  const [chartType, setChartType] = useState('bar');

  // Opções dinâmicas para o ECharts
  const getChartOptions = () => {
    const baseGrid = { top: 60, right: 30, bottom: 40, left: 50 };

    switch (chartType) {
      case 'bar':
        return {
          title: { text: 'Performance Mensal (Barras)', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          grid: baseGrid,
          xAxis: { type: 'category', data: MOCK_DATA.months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Realizado', type: 'bar', data: MOCK_DATA.sales, itemStyle: { borderRadius: [4, 4, 0, 0] } },
            { name: 'Meta', type: 'bar', data: MOCK_DATA.targets, itemStyle: { borderRadius: [4, 4, 0, 0] } },
          ],
        };

      case 'line':
        return {
          title: { text: 'Tendência de Vendas (Linha Suave)', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          grid: baseGrid,
          xAxis: { type: 'category', data: MOCK_DATA.months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Realizado', type: 'line', smooth: true, data: MOCK_DATA.sales, areaStyle: { opacity: 0.15 } },
            { name: 'Meta', type: 'line', smooth: true, data: MOCK_DATA.targets, lineStyle: { type: 'dashed' } },
          ],
        };

      case 'pie':
        return {
          title: { text: 'Distribuição Semestral (Rosca)', left: 'center' },
          tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
          legend: { orient: 'vertical', left: 'left' },
          series: [
            {
              name: 'Vendas',
              type: 'pie',
              radius: ['45%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
              data: MOCK_DATA.months.map((month, idx) => ({
                name: month,
                value: MOCK_DATA.sales[idx],
              })),
            },
          ],
        };

      case 'radar':
        return {
          title: { text: 'Comparativo Multidimensional (Radar)', left: 'center' },
          tooltip: {},
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          radar: {
            indicator: MOCK_DATA.months.map((m) => ({ name: m, max: 350 })),
          },
          series: [
            {
              type: 'radar',
              data: [
                { value: MOCK_DATA.sales, name: 'Realizado' },
                { value: MOCK_DATA.targets, name: 'Meta' },
              ],
            },
          ],
        };

      default:
        return {};
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <span className={styles.label}>Selecione o Formato:</span>
        <div className={styles.buttonGroup}>
          <button 
            className={chartType === 'bar' ? styles.activeBtn : styles.btn} 
            onClick={() => setChartType('bar')}
          >
            Barras
          </button>
          <button 
            className={chartType === 'line' ? styles.activeBtn : styles.btn} 
            onClick={() => setChartType('line')}
          >
            Linha & Área
          </button>
          <button 
            className={chartType === 'pie' ? styles.activeBtn : styles.btn} 
            onClick={() => setChartType('pie')}
          >
            Rosca (Donut)
          </button>
          <button 
            className={chartType === 'radar' ? styles.activeBtn : styles.btn} 
            onClick={() => setChartType('radar')}
          >
            Radar
          </button>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ReactECharts 
          option={getChartOptions()} 
          style={{ height: '420px', width: '100%' }} 
          notMerge={true} 
        />
      </div>
    </div>
  );
}
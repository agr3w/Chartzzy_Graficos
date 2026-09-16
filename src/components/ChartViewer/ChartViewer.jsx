import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './ChartViewer.module.css';

const INITIAL_DATA = [
  { month: 'Jan', sales: 120, target: 100 },
  { month: 'Fev', sales: 200, target: 180 },
  { month: 'Mar', sales: 150, target: 160 },
  { month: 'Abr', sales: 80, target: 100 },
  { month: 'Mai', sales: 270, target: 240 },
  { month: 'Jun', sales: 310, target: 280 },
];

export default function ChartViewer() {
  const [data, setData] = useState(INITIAL_DATA);
  const [chartType, setChartType] = useState('bar');

  const handleValueChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = Number(value) || 0;
    setData(updated);
  };

  const months = data.map((d) => d.month);
  const sales = data.map((d) => d.sales);
  const targets = data.map((d) => d.target);

  const getChartOptions = () => {
    const baseGrid = { top: 60, right: 30, bottom: 40, left: 50 };

    switch (chartType) {
      case 'bar':
        return {
          title: { text: 'Performance Mensal', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          grid: baseGrid,
          xAxis: { type: 'category', data: months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Realizado', type: 'bar', data: sales, itemStyle: { borderRadius: [4, 4, 0, 0] } },
            { name: 'Meta', type: 'bar', data: targets, itemStyle: { borderRadius: [4, 4, 0, 0] } },
          ],
        };

      case 'line':
        return {
          title: { text: 'Tendência e Metas', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          grid: baseGrid,
          xAxis: { type: 'category', data: months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Realizado', type: 'line', smooth: true, data: sales, areaStyle: { opacity: 0.15 } },
            { name: 'Meta', type: 'line', smooth: true, data: targets, lineStyle: { type: 'dashed' } },
          ],
        };

      case 'pie':
        return {
          title: { text: 'Distribuição Semestral', left: 'center' },
          tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
          legend: { orient: 'vertical', left: 'left' },
          series: [
            {
              name: 'Realizado',
              type: 'pie',
              radius: ['45%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
              data: data.map((d) => ({ name: d.month, value: d.sales })),
            },
          ],
        };

      case 'radar': {
        const maxVal = Math.max(...sales, ...targets, 100) * 1.2;
        return {
          title: { text: 'Radar Comparativo', left: 'center' },
          tooltip: {},
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          radar: {
            indicator: months.map((m) => ({ name: m, max: Math.round(maxVal) })),
          },
          series: [
            {
              type: 'radar',
              data: [
                { value: sales, name: 'Realizado' },
                { value: targets, name: 'Meta' },
              ],
            },
          ],
        };
      }

      default:
        return {};
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <span className={styles.label}>Formato:</span>
        <div className={styles.buttonGroup}>
          {['bar', 'line', 'pie', 'radar'].map((type) => (
            <button
              key={type}
              className={chartType === type ? styles.activeBtn : styles.btn}
              onClick={() => setChartType(type)}
            >
              {type === 'bar' && 'Barras'}
              {type === 'line' && 'Linha'}
              {type === 'pie' && 'Rosca'}
              {type === 'radar' && 'Radar'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ReactECharts option={getChartOptions()} className={styles.chart} style={{ width: '100%' }} notMerge={true} />
      </div>

      <div className={styles.editorSection}>
        <h4 className={styles.editorTitle}>Editar Dados em Tempo Real</h4>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Realizado</th>
                <th>Meta</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.month}>
                  <td className={styles.monthLabel}>{row.month}</td>
                  <td>
                    <input
                      type="number"
                      className={styles.input}
                      value={row.sales}
                      onChange={(e) => handleValueChange(idx, 'sales', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={styles.input}
                      value={row.target}
                      onChange={(e) => handleValueChange(idx, 'target', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
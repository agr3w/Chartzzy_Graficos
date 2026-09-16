import { useState, useEffect, useCallback, useRef } from 'react';
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

const CHART_TYPES = ['bar', 'line', 'pie', 'radar'];

export default function ChartViewer() {
  const [data, setData] = useState(INITIAL_DATA);
  const [chartType, setChartType] = useState('bar');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const containerRef = useRef(null);

  const handleValueChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = Number(value) || 0;
    setData(updated);
  };

  const months = data.map((d) => d.month);
  const sales = data.map((d) => d.sales);
  const targets = data.map((d) => d.target);

  // Alternância cíclica de gráficos pelas teclas direcionais
  const nextChart = useCallback(() => {
    setChartType((prev) => {
      const idx = CHART_TYPES.indexOf(prev);
      return CHART_TYPES[(idx + 1) % CHART_TYPES.length];
    });
  }, []);

  const prevChart = useCallback(() => {
    setChartType((prev) => {
      const idx = CHART_TYPES.indexOf(prev);
      return CHART_TYPES[(idx - 1 + CHART_TYPES.length) % CHART_TYPES.length];
    });
  }, []);

  // Atalhos de teclado no modo apresentação
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPresentationMode) return;
      if (e.key === 'ArrowRight' || e.key === ' ') nextChart();
      if (e.key === 'ArrowLeft') prevChart();
      if (e.key === 'Escape') setIsPresentationMode(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, nextChart, prevChart]);

  const getChartOptions = () => {
    const baseGrid = { top: 70, right: 40, bottom: 50, left: 60 };

    // Barra de ferramentas nativa (Download PNG, Zoom e alternância de view)
    const toolbox = {
      feature: {
        saveAsImage: { title: 'Exportar Imagem', pixelRatio: 2 },
        dataZoom: { title: { zoom: 'Zoom', back: 'Resetar' } },
        restore: { title: 'Restaurar' },
      },
      right: 20,
      top: 15,
    };

    switch (chartType) {
      case 'bar':
        return {
          title: { text: 'Performance Mensal', subtext: 'Valores Realizados vs Meta', left: 'left' },
          tooltip: { trigger: 'axis' },
          toolbox,
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          grid: baseGrid,
          xAxis: { type: 'category', data: months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Realizado', type: 'bar', data: sales, itemStyle: { borderRadius: [4, 4, 0, 0], color: '#3b82f6' } },
            { name: 'Meta', type: 'bar', data: targets, itemStyle: { borderRadius: [4, 4, 0, 0], color: '#94a3b8' } },
          ],
        };

      case 'line':
        return {
          title: { text: 'Tendência e Metas', subtext: 'Evolução ao longo dos meses', left: 'left' },
          tooltip: { trigger: 'axis' },
          toolbox,
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          grid: baseGrid,
          xAxis: { type: 'category', data: months },
          yAxis: { type: 'value' },
          series: [
            { name: 'Realizado', type: 'line', smooth: true, data: sales, areaStyle: { opacity: 0.2 }, itemStyle: { color: '#2563eb' } },
            { name: 'Meta', type: 'line', smooth: true, data: targets, lineStyle: { type: 'dashed' }, itemStyle: { color: '#64748b' } },
          ],
        };

      case 'pie':
        return {
          title: { text: 'Distribuição Semestral', subtext: 'Proporção do total de vendas', left: 'left' },
          tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
          toolbox,
          legend: { orient: 'vertical', left: 'left', top: 60 },
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
          title: { text: 'Radar Comparativo', subtext: 'Cobertura por período', left: 'left' },
          tooltip: {},
          toolbox,
          legend: { data: ['Realizado', 'Meta'], top: 30 },
          radar: {
            indicator: months.map((m) => ({ name: m, max: Math.round(maxVal) })),
          },
          series: [
            {
              type: 'radar',
              data: [
                { value: sales, name: 'Realizado', areaStyle: { opacity: 0.3 } },
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
    <div 
      ref={containerRef} 
      className={isPresentationMode ? styles.presentationContainer : styles.container}
    >
      <div className={styles.headerBar}>
        <div className={styles.controls}>
          <span className={styles.label}>Formato:</span>
          <div className={styles.buttonGroup}>
            {CHART_TYPES.map((type) => (
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

        <button
          className={styles.presentationBtn}
          onClick={() => setIsPresentationMode((prev) => !prev)}
        >
          {isPresentationMode ? 'Sair do Modo Apresentação (Esc)' : '🖥️ Modo Apresentação'}
        </button>
      </div>

      <div className={isPresentationMode ? styles.fullscreenChart : styles.chartWrapper}>
        <ReactECharts
          option={getChartOptions()}
          style={{ height: isPresentationMode ? '75vh' : '420px', width: '100%' }}
          notMerge={true}
        />
      </div>

      {isPresentationMode && (
        <div className={styles.presentationFooter}>
          <span>Dica: Use <strong>←</strong> e <strong>→</strong> para trocar o gráfico ou <strong>Esc</strong> para sair.</span>
        </div>
      )}

      {!isPresentationMode && (
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
      )}
    </div>
  );
}
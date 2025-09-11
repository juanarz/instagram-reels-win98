import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LabelList, ComposedChart, Area,
  ReferenceLine, Line
} from 'recharts';

const ReelInsight = ({ reel }) => {
  // State to track which metrics are visible
  const [visibleMetrics, setVisibleMetrics] = React.useState({
    views: true,
    interactions: true,
    follows: true
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };
  
  // Calculate engagement rate
  const engagementRate = ((reel.likes + reel.comments + reel.shares) / reel.views * 100).toFixed(2);
  
  // Sample data for engagement rates (in a real app, this would come from your backend)
  const engagementRates = [
    1.8, 2.1, 2.3, 2.5, 2.7, 2.8, 3.0, 3.2, 3.5, 3.7,
    3.8, 4.0, 4.2, 4.5, 4.7, 4.8, 5.0, 5.2, 5.5, 5.8,
    6.0, 6.2, 6.5, 6.7, 7.0, 7.2, 7.5, 7.8, 8.0, 8.5
  ];
  
  // Calculate boxplot statistics
  const calculateBoxplotStats = (data) => {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const median = quantile(sorted, 0.5);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(sorted[0], q1 - 1.5 * iqr);
    const upperWhisker = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr);
    const outliers = sorted.filter(d => d < lowerWhisker || d > upperWhisker);
    
    return {
      min: sorted[0],
      q1,
      median,
      q3,
      max: sorted[sorted.length - 1],
      lowerWhisker,
      upperWhisker,
      outliers
    };
  };
  
  // Helper function to calculate quantiles
  const quantile = (sorted, q) => {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };
  
  const boxplotData = calculateBoxplotStats(engagementRates);
  const currentER = parseFloat(engagementRate);
  
  // Data for different chart types
  const getChartData = () => {
    // 🎥 POV: Le pides un lápiz al de sistemas
    if (reel.title.includes("un lápiz al de sistemas")) {
      const interactions = reel.likes + reel.comments + reel.shares;
      const interactionRate = ((interactions / reel.views) * 100).toFixed(2);
      const followRate = ((reel.follows / reel.views) * 100).toFixed(2);
      
      return {
        type: 'enhancedBar',
        data: [
          { 
            name: 'Vistas', 
            value: reel.views,
            formatted: reel.views >= 1000000 
              ? `${(reel.views / 1000000).toFixed(1)}M` 
              : `${(reel.views / 1000).toFixed(0)}K`,
            details: `${reel.views.toLocaleString()} visualizaciones`
          },
          { 
            name: 'Interacciones', 
            value: interactions,
            formatted: interactions >= 1000000 
              ? `${(interactions / 1000000).toFixed(1)}M` 
              : `${(interactions / 1000).toFixed(0)}K`,
            details: `
              • ${reel.likes.toLocaleString()} Me gusta
              • ${reel.comments.toLocaleString()} Comentarios
              • ${reel.shares.toLocaleString()} Compartidos
              • Tasa: ${interactionRate}%`
          },
          { 
            name: 'Nuevos Seguidores', 
            value: reel.follows,
            formatted: reel.follows.toLocaleString(),
            details: `
              • ${reel.follows.toLocaleString()} nuevos seguidores
              • Tasa de conversión: ${followRate}%
              • ${Math.round(interactions / reel.follows)} interacciones por seguidor`
          }
        ],
        insight: 'No fue el más viral, pero convirtió muy bien, mostrando que los reels de humor de nicho generan engagement profundo.'
      };
    } 
    // 🎥 POV: Te gradúas de ingeniero
    else if (reel.title.includes("Te gradúas de ingeniero")) {
      return {
        type: 'boxplot',
        data: [
          {
            name: 'Distribución de ER',
            ...boxplotData,
            current: currentER
          },
          {
            name: 'Este Reel',
            value: currentER
          }
        ],
        stats: {
          currentER: currentER,
          medianER: boxplotData.median,
          minER: boxplotData.min,
          maxER: boxplotData.max,
          q1: boxplotData.q1,
          q3: boxplotData.q3
        },
        insight: `La tasa de engagement de este reel (${currentER}%) está ${currentER > boxplotData.median ? 'por encima' : 'por debajo'} de la mediana general (${boxplotData.median.toFixed(2)}%) y ${currentER >= boxplotData.q1 && currentER <= boxplotData.q3 ? 'dentro' : 'fuera'} del rango intercuartílico típico (${boxplotData.q1.toFixed(2)}% - ${boxplotData.q3.toFixed(2)}%), lo que indica un desempeño ${currentER > boxplotData.q3 ? 'superior al promedio' : currentER < boxplotData.q1 ? 'inferior al promedio' : 'estable'} comparado con el resto de los reels.`
      };
    } 
    // 🎥 POV: Se te cae tu botella en San Gil
    else if (reel.title.includes("Se te cae tu botella")) {
      return {
        type: 'stackedBar',
        data: [
          { 
            name: 'Alcance vs Interacción',
            'Cuentas Alcanzadas': reel.accountsReached || reel.views,
            'Cuentas que Interactuaron': reel.accountsEngaged || (reel.likes + reel.comments + reel.shares)
          }
        ],
        insight: 'Los resultados muestran una clara preferencia por las respuestas, con la opción más votada alcanzando el 84%. Este tipo de contenido de participación genera una alta interacción, como lo demuestran los comentarios y reacciones. El formato de pregunta directa y las opciones específicas parecen resonar bien con tu audiencia, lo que lo convierte en un formato a replicar.'
      };
    } 
    // 🎥 Qué prenda te daría pena traer a la U
    else if (reel.title.includes("Qué prenda")) {
      return {
        type: 'pie',
        data: [
          { name: 'Me gusta', value: reel.likes },
          { name: 'Comentarios', value: reel.comments },
          { name: 'Compartidos', value: reel.shares },
          { name: 'Guardados', value: reel.saves || 0 },
          { name: 'Nuevos seguidores', value: reel.follows }
        ],
        insight: `Este reel generó una gran interacción con ${reel.likes.toLocaleString()} me gusta y ${reel.comments.toLocaleString()} comentarios. Los compartidos (${reel.shares}) y guardados (${reel.saves || 0}) indican que el contenido es valioso para la audiencia. La conversión a ${reel.follows} nuevos seguidores demuestra que el tema resuena con tu público objetivo.`
      };
    } 
    // 🎥 POV: Seguridad ante todo
    else if (reel.title.includes("Seguridad ante todo")) {
      return {
        type: 'boxplot',
        data: [
          {
            name: 'Distribución de ER',
            ...boxplotData,
            current: currentER
          },
          {
            name: 'Este Reel',
            value: currentER
          }
        ],
        stats: {
          currentER: currentER,
          medianER: boxplotData.median,
          minER: boxplotData.min,
          maxER: boxplotData.max,
          q1: boxplotData.q1,
          q3: boxplotData.q3
        },
        insight: `La tasa de engagement de este reel (${currentER}%) está ${currentER > boxplotData.median ? 'por encima' : 'por debajo'} de la mediana general (${boxplotData.median.toFixed(2)}%) y ${currentER >= boxplotData.q1 && currentER <= boxplotData.q3 ? 'dentro' : 'fuera'} del rango intercuartílico típico (${boxplotData.q1.toFixed(2)}% - ${boxplotData.q3.toFixed(2)}%), lo que indica un desempeño ${currentER > boxplotData.q3 ? 'superior al promedio' : currentER < boxplotData.q1 ? 'inferior al promedio' : 'estable'} comparado con el resto de los reels.`
      };
    } 
    // 🎥 POV: Te gradúas de ingeniero
    else if (reel.title.includes("Te gradúas de ingeniero")) {
      return {
        type: 'scatter',
        data: [
          { 
            x: reel.views / 1000, // Scale for better visualization
            y: parseFloat(engagementRate),
            z: reel.follows,
            size: reel.comments // Size by number of comments
          }
        ],
        insight: 'Aunque tuvo menos views, su ER fue altísimo, demostrando el poder de los contenidos de nicho en fidelización.'
      };
    }
    // 🎥 Mi última diapositiva
    else if (reel.title.includes("Mi última diapositiva")) {
      return {
        type: 'comparisonBar',
        data: [
          { name: 'Vistas', value: reel.views },
          { name: 'Interacciones', value: reel.likes + reel.comments + reel.shares },
          { name: 'Nuevos Seguidores', value: reel.follows }
        ],
        insight: 'Es el reel más viral y el que más convirtió, con un balance único entre alcance masivo y conexión real.'
      };
    }
    // Default chart for other reels
    else {
      return {
        type: 'bar',
        data: [
          { name: 'Vistas', value: reel.views },
          { name: 'Me gusta', value: reel.likes },
          { name: 'Comentarios', value: reel.comments },
          { name: 'Compartidos', value: reel.shares }
        ],
        insight: `Tasa de engagement: ${engagementRate}%`
      };
    }
  };

  const chartConfig = getChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#000080' }}>{data.name}</p>
          <p style={{ margin: '0 0 5px 0' }}>{data.details}</p>
          {data.name === 'Interacciones' && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', fontStyle: 'italic', margin: '5px 0 0 0' }}>engagement: {((payload[0].value / reel.views) * 100).toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Función para renderizar checkboxes en horizontal
  const renderHorizontalCheckboxes = (metrics) => {
    // Default colors if not provided
    const defaultColors = {
      views: '#8884d8',
      interactions: '#82ca9d',
      follows: '#ffc658'
    };
    
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '5px',
        flexWrap: 'wrap',
        width: '100%',
        margin: '0',
        boxSizing: 'border-box'
      }}>
        {metrics.map((metric) => (
          <div 
            key={metric.key} 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              flex: '1 1 0%',
              minWidth: '120px',
              padding: '5px 10px',
              backgroundColor: visibleMetrics[metric.key] ? `${metric.color || defaultColors[metric.key] || '#fff'}33` : '#fff',
              borderRadius: '4px',
              border: '1px solid rgb(221, 221, 221)',
              justifyContent: 'center'
            }}
          >
            <input
              type="checkbox"
              id={`checkbox-${metric.key}`}
              checked={visibleMetrics[metric.key]}
              onChange={() => toggleMetric(metric.key)}
              style={{
                appearance: 'none',
                width: '18px',
                height: '18px',
                border: '2px solid rgb(0, 0, 0)',
                backgroundColor: visibleMetrics[metric.key] ? (metric.color || defaultColors[metric.key] || '#888888') : '#fff',
                borderColor: visibleMetrics[metric.key] ? (metric.color || defaultColors[metric.key] || '#888888') : '#000',
                marginRight: '10px',
                boxShadow: 'rgb(250, 250, 250) 1px 1px 0px inset, rgb(0, 0, 0) -1px -1px 0px inset',
                cursor: 'pointer',
                flexShrink: 0,
                transition: '0.2s',
                position: 'relative',
                top: '-1px'
              }}
            />
            <label 
              htmlFor={`checkbox-${metric.key}`}
              style={{
                cursor: 'pointer',
                fontSize: '14px',
                margin: '0px',
                display: 'inline-flex',
                alignItems: 'center',
                color: 'rgb(13, 13, 13)',
                userSelect: 'none'
              }}
            >
              {metric.name}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    if (!chartConfig) return null;

    switch (chartConfig.type) {
      case 'enhancedBar':
        const enhancedMetrics = [
          { key: 'views', name: 'Views', color: '#8884d8' },
          { key: 'interactions', name: 'Interactions', color: '#82ca9d' },
          { key: 'follows', name: 'New Follows', color: '#ffc658' }
        ];

        const enhancedChartData = chartConfig.data.filter((_, index) => {
          const metricKey = ['views', 'interactions', 'follows'][index];
          return visibleMetrics[metricKey];
        });

        return (
          <div style={{ width: '100%' }}>
            <div style={{ height: '250px', marginBottom: '5px', width: '110%', marginLeft: '-5%', padding: '0 10px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={enhancedChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke="#8884d8"
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                    width={60}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="value" 
                    name="Métricas"
                    barSize={60}
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {enhancedChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Vistas' ? '#8884d8' : 
                              entry.name === 'Interacciones' ? '#82ca9d' : '#ffc658'}
                        style={{
                          filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                    <LabelList 
                      dataKey="formatted"
                      position="top"
                      offset={10}
                      style={{ 
                        fill: 'black', 
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {renderHorizontalCheckboxes(enhancedMetrics)}
            
            <p style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#666', 
              fontStyle: 'italic',
              marginTop: '10px'
            }}>
              Pasa el cursor sobre las barras para ver más detalles
            </p>
          </div>
        );
      
      case 'pie':
        return (
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartConfig.data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelStyle={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fill: '#333',
                    textShadow: '0 0 2px white'
                  }}
                >
                  {chartConfig.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      name={entry.name} // Ensure name is passed for tooltip
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value.toLocaleString()} (${(props.payload.percent * 100).toFixed(1)}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  formatter={(value, entry, index) => (
                    <span style={{ 
                      color: '#333', 
                      fontSize: '11px',
                      margin: '0 8px'
                    }}>
                      {chartConfig.data[index]?.name}
                    </span>
                  )}
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    textAlign: 'center',
                    width: '100%'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'boxplot':
        const boxData = chartConfig.data[0];
        const currentER = parseFloat(engagementRate);
        const medianER = boxData.median;
        const minER = boxData.min;
        const maxER = boxData.max;
        const q1 = boxData.q1;
        const q3 = boxData.q3;
        
        // Datos para el gráfico de comparación
        const comparisonData = [
          { 
            name: 'Este Reel', 
            value: currentER,
            color: currentER >= medianER ? '#82ca9d' : '#ff7300'
          },
          { 
            name: 'Mediana', 
            value: medianER,
            color: '#8884d8'
          }
        ];

        return (
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart
                data={comparisonData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  label={{ value: 'Métrica', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  label={{ value: 'Tasa de Engagement (%)', angle: -90, position: 'center' }}
                  domain={[0, Math.max(maxER * 1.5, currentER * 1.5)]}
                />
                
                <Bar 
                  dataKey="value"
                  fill="#8884d8"
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    formatter={(value) => `${value.toFixed(2)}%`}
                  />
                </Bar>
                
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Tasa de Engagement']}
                />
                
                <ReferenceLine 
                  y={medianER}
                  stroke="#000"
                  strokeDasharray="3 3"
                  label={{ value: 'Mediana', position: 'insideTopRight', fill: 'black', }}
                />
                
                <Legend content={() => null} />
              </BarChart>
            </ResponsiveContainer>
           
          </div>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Vistas (millones)" 
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={(value) => `${value.toFixed(1)}M`}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Tasa de Engagement %" 
                domain={[0, 15]}
                tickFormatter={(value) => `${value}%`}
              />
              <ZAxis type="number" dataKey="z" range={[100, 500]} name="Nuevos Seguidores" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'x') return [`${parseFloat(value).toFixed(2)}M`, 'Vistas'];
                  if (name === 'y') return [`${parseFloat(value).toFixed(2)}%`, 'Tasa de Engagement'];
                  return [value, name];
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend />
              <Scatter 
                name="Rendimiento" 
                data={chartConfig.data} 
                fill="#8884d8"
                shape="circle"
              >
                <LabelList 
                  dataKey="z" 
                  formatter={(value) => `${value} seguidores`}
                  position="top"
                />
              </Scatter>
              {chartConfig.type === 'boxplot' && renderBoxplot(chartConfig.data)}
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'stackedBar':
        return (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartConfig.data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  return [value.toLocaleString(), name];
                }}
              />
              <Legend />
              <Bar dataKey="Cuentas Alcanzadas" stackId="a" fill="#8884d8" name="Cuentas Alcanzadas" />
              <Bar dataKey="Cuentas que Interactuaron" stackId="a" fill="#82ca9d" name="Cuentas que Interactuaron" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'comparisonBar':
        const renderEnhancedBarChart = (data) => {
          const metrics = [
            { key: 'views', name: 'Views', value: data.views, color: '#8884d8' },
            { key: 'interactions', name: 'Interactions', value: data.interactions, color: '#82ca9d' },
            { key: 'follows', name: 'New Follows', value: data.follows, color: '#ffc658' }
          ];

          const chartData = metrics.filter(metric => visibleMetrics[metric.key]);

          return (
            <div style={{ width: '100%' }}>
              <div style={{ height: '250px', marginBottom: '20px' }}>
                <ResponsiveContainer>
                  <ComposedChart 
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#333' }}
                      tickFormatter={() => ''}
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="#8884d8"
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value;
                      }}
                      width={60}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="value" 
                      name="Métricas"
                      barSize={60}
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          style={{
                            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                      <LabelList 
                        dataKey="value"
                        position="insideBottom"
                        offset={-30}
                        style={{ 
                          fill: '#fff', 
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}
                        formatter={(value) => value.toLocaleString()}
                      />
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {renderHorizontalCheckboxes(metrics)}
              
              <p style={{ 
                textAlign: 'center', 
                fontSize: '12px', 
                color: '#666', 
                fontStyle: 'italic',
                marginTop: '10px'
              }}>
                Haz clic o pasa el cursor sobre las barras para ver más detalles
              </p>
            </div>
          );
        };

        const data = {
          views: chartConfig.data[0].value,
          interactions: chartConfig.data[1].value,
          follows: chartConfig.data[2].value
        };

        return renderEnhancedBarChart(data);
      
      default:
        return (
          <div
            style={{
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#666',
              fontStyle: 'italic'
            }}
          >
            No hay datos de visualización disponibles para este reel.
          </div>
        );
    }
  };

  const renderBoxplot = (data) => {
    const { min, q1, median, q3, max, lowerWhisker, upperWhisker, outliers, current } = data[0];
    const width = 800;
    const height = 400;
    const padding = 60;
    const boxWidth = 100;
    
    // Scale function for the y-axis
    const scaleY = (value) => {
      const range = max - min;
      return height - padding - ((value - min) / range) * (height - 2 * padding);
    };
    
    // Calculate positions
    const boxY = scaleY(q3);
    const boxHeight = scaleY(q1) - boxY;
    const medianY = scaleY(median);
    const whiskerBottom = scaleY(lowerWhisker);
    const whiskerTop = scaleY(upperWhisker);
    const centerX = width / 2;
    
    return (
      <div style={{ width: '100%', margin: '20px 0' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Distribución de Tasas de Engagement</h3>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y Axis */}
          <line 
            x1={padding} 
            y1={height - padding} 
            x2={padding} 
            y2={padding} 
            stroke="#333" 
            strokeWidth="1.5"
          />
          
          {/* Y Axis Ticks and Labels */}
          {[min, q1, median, q3, max].map((value, i) => (
            <g key={`y-tick-${i}`}>
              <line 
                x1={padding - 5} 
                y1={scaleY(value)} 
                x2={padding} 
                y2={scaleY(value)} 
                stroke="#333" 
                strokeWidth="1"
              />
              <text 
                x={padding - 10} 
                y={scaleY(value) + 4} 
                textAnchor="end" 
                fontSize="12"
                fill="#333"
              >
                {value.toFixed(1)}%
              </text>
            </g>
          ))}
          
          {/* X Axis */}
          <line 
            x1={padding} 
            y1={height - padding} 
            x2={width - padding} 
            y2={height - padding} 
            stroke="#333" 
            strokeWidth="1.5" 
          />
          
          {/* Box */}
          <rect 
            x={centerX - boxWidth/2} 
            y={boxY} 
            width={boxWidth} 
            height={boxHeight} 
            fill="#8884d8" 
            fillOpacity="0.6"
            stroke="#5a5aad"
            strokeWidth="1.5"
            rx="2"
          />
          
          {/* Median line */}
          <line 
            x1={centerX - boxWidth/2} 
            y1={medianY} 
            x2={centerX + boxWidth/2} 
            y2={medianY} 
            stroke="#ff7300" 
            strokeWidth="2"
          />
          
          {/* Whiskers */}
          <line 
            x1={centerX - boxWidth/4} 
            y1={whiskerTop} 
            x2={centerX + boxWidth/4} 
            y2={whiskerTop} 
            stroke="#333" 
            strokeWidth="1.5"
          />
          <line 
            x1={centerX} 
            y1={whiskerTop} 
            x2={centerX} 
            y2={boxY} 
            stroke="#333" 
            strokeWidth="1.5"
          />
          
          <line 
            x1={centerX - boxWidth/4} 
            y1={whiskerBottom} 
            x2={centerX + boxWidth/4} 
            y2={whiskerBottom} 
            stroke="#333" 
            strokeWidth="1.5"
          />
          <line 
            x1={centerX} 
            y1={whiskerBottom} 
            x2={centerX} 
            y2={boxY + boxHeight} 
            stroke="#333" 
            strokeWidth="1.5"
          />
          
          {/* Outliers */}
          {outliers && outliers.map((outlier, i) => (
            <circle 
              key={`outlier-${i}`}
              cx={centerX + (i % 2 === 0 ? -1 : 1) * (boxWidth/2 + 20 + (Math.floor(i/2) * 15))} 
              cy={scaleY(outlier)} 
              r="4" 
              fill="#ff4d4f"
              stroke="#d9363e"
              strokeWidth="1"
            />
          ))}
          
          {/* Current Reel's ER */}
          <circle 
            cx={width - padding - 50} 
            cy={scaleY(current)} 
            r="8" 
            fill="#52c41a"
            stroke="#237804"
            strokeWidth="1.5"
          />
          <text 
            x={width - padding - 35} 
            y={scaleY(current) + 4} 
            fontSize="12" 
            fontWeight="500"
            fill="#237804"
          >
            Este reel: {current}%
          </text>
          
          {/* Legend */}
          <g transform={`translate(${centerX - 100}, ${padding + 10})`}>
            <rect x="0" y="0" width="12" height="12" fill="#8884d8" rx="2" />
            <text x="18" y="10" fontSize="11" fill="#333">Rango intercuartílico (Q1-Q3)</text>
            
            <rect x="0" y="20" width="12" height="12" fill="#ff7300" rx="2" />
            <text x="18" y="30" fontSize="11" fill="#333">Mediana</text>
            
            <circle cx="6" y="45" r="4" fill="#ff4d4f" />
            <text x="18" y="49" fontSize="11" fill="#333">Valores atípicos</text>
            
            <circle cx="6" y="65" r="5" fill="#52c41a" stroke="#237804" strokeWidth="1" />
            <text x="18" y="69" fontSize="11" fill="#333">Este reel</text>
          </g>
          
          {/* Y Axis Label */}
          <text 
            x={-height/2} 
            y="20" 
            transform="rotate(-90)" 
            textAnchor="middle" 
            fontSize="12"
            fontWeight="500"
            fill="#333"
          >
            Tasa de Engagement (%)
          </text>
          
          {/* Stats Summary */}
          <g transform={`translate(${centerX - 100}, ${height - padding + 40})`}>
            <text x="0" y="0" fontSize="12" fontWeight="500" fill="#333">Estadísticas:</text>
            <text x="0" y="20" fontSize="11" fill="#333">• Mínimo: {min.toFixed(1)}%</text>
            <text x="150" y="20" fontSize="11" fill="#333">• Q1: {q1.toFixed(1)}%</text>
            <text x="0" y="40" fontSize="11" fill="#333">• Mediana: {median.toFixed(1)}%</text>
            <text x="150" y="40" fontSize="11" fill="#333">• Q3: {q3.toFixed(1)}%</text>
            <text x="0" y="60" fontSize="11" fill="#333">• Máximo: {max.toFixed(1)}%</text>
            <text x="150" y="60" fontSize="11" fill="#52c41a" fontWeight="500">• Este reel: {current.toFixed(1)}%</text>
          </g>
        </svg>
        
        <div style={{ 
          margin: '20px 0 0', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px',
          borderLeft: '4px solid #8884d8'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: '500', color: '#2c3e50' }}>Interpretación del gráfico:</p>
          <ul style={{ 
            margin: '0 0 0 20px', 
            padding: '0',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#4a5568'
          }}>
            <li>La <strong>caja azul</strong> muestra el rango intercuartílico (IQR) que contiene el 50% central de los datos.</li>
            <li>La <strong>línea naranja</strong> representa la mediana, el valor que divide los datos en dos mitades iguales.</li>
            <li>Los <strong>bigotes</strong> se extienden hasta el valor mínimo y máximo, excluyendo valores atípicos.</li>
            <li>Los <strong>puntos rojos</strong> son valores atípicos inusuales que están fuera del rango típico.</li>
            <li>El <strong>punto verde</strong> muestra la tasa de engagement de este reel en comparación con la distribución general.</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="reel-insight" style={{ 
      border: '2px solid #c0c0c0',
      borderStyle: 'groove',
      padding: '15px',
      margin: '15px 0',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      boxShadow: 'inset -1px -1px 0 0 #fff, inset 1px 1px 0 0 #808080',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '380px',
      margin: '15px auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: '#000080',
        paddingBottom: '8px',
        borderBottom: '1px solid #c0c0c0'
      }}>
        🧐 Análisis de rendimiento
      </h4>

      <div
        style={{
          flex: '1',
          minHeight: '250px',
          marginBottom: '15px',
          transition: 'all 0.3s ease',
          opacity: 1,
          pointerEvents: 'all'
        }}
      >
        {renderChart()}
      </div>

      <div
        style={{
          padding: '12px',
          backgroundColor: '#e8f4f8',
          borderRadius: '4px',
          border: '1px solid #c0c0c0',
          boxShadow: 'inset 1px 1px 0 0 #fff',
          fontSize: '13px',
          lineHeight: '1.4',
          marginBottom: '15px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
            color: '#000080',
            fontWeight: 'bold',
          }}
        >
          <span style={{ marginRight: '6px' }}>☝️🤓</span> Insight:
        </div>
        <div style={{ paddingLeft: '20px' }}>{chartConfig.insight}</div>
      </div>
    </div>
  );
};

export default ReelInsight;
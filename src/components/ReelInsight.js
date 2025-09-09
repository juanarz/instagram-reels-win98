import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LabelList, ComposedChart, Area
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
    // 🎥 Seguridad ante todo
    else if (reel.title.includes("Seguridad ante todo")) {
      return {
        type: 'scatter',
        data: [
          { 
            x: reel.views / 1000000, // Scale for better visualization
            y: parseFloat(engagementRate),
            z: reel.follows,
            size: reel.likes / 5000 // Scale for bubble size
          }
        ],
        insight: 'Alcanzó millones, pero con bajo ER, mostrando que el alcance masivo no siempre significa conexión real.'
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
        insight: 'Menos views que otros virales, pero gran conversión a seguidores (732), prueba de que la autenticidad convierte.'
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
          { name: 'Guardados', value: reel.saves }
        ],
        insight: 'Generó más conversación en comentarios que otros, mostrando que fomenta debate y participación activa.'
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
            <p style={{ margin: '5px 0 0 0', fontSize: '0.85em', color: '#666' }}>
              Tasa de engagement: {((payload[0].value / reel.views) * 100).toFixed(2)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!chartConfig) return null;

    switch (chartConfig.type) {
      case 'enhancedBar':
        const enhancedMetrics = [
          { key: 'views', name: 'Vistas', color: '#8884d8' },
          { key: 'interactions', name: 'Interacciones', color: '#82ca9d' },
          { key: 'follows', name: 'Nuevos Seguidores', color: '#ffc658' }
        ];

        const enhancedChartData = chartConfig.data.filter((_, index) => {
          const metricKey = ['views', 'interactions', 'follows'][index];
          return visibleMetrics[metricKey];
        });

        return (
          <div style={{ width: '100%' }}>
            <div style={{ height: '250px', marginBottom: '20px' }}>
              <ResponsiveContainer>
                <ComposedChart 
                  data={enhancedChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#333' }}
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
                      position="insideBottom"
                      offset={-30}
                      style={{ 
                        fill: '#fff', 
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              marginTop: '10px', 
              padding: '0 20px' 
            }}>
              {enhancedMetrics.map((metric) => (
                <label 
                  key={metric.key} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    color: visibleMetrics[metric.key] ? '#000' : '#888',
                    fontSize: '14px',
                    userSelect: 'none'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={visibleMetrics[metric.key]} 
                    onChange={() => toggleMetric(metric.key)}
                    style={{
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      border: '2px solid #000',
                      backgroundColor: visibleMetrics[metric.key] ? metric.color : '#fff',
                      marginRight: '8px',
                      position: 'relative',
                      boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #000',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  {metric.name}
                </label>
              ))}
            </div>
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {chartConfig.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value.toLocaleString(), name]}
                />
                <Legend />
              </PieChart>
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
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', padding: '0 20px' }}>
                {metrics.map((metric) => (
                  <label key={metric.key} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    color: visibleMetrics[metric.key] ? '#000' : '#888',
                    fontSize: '14px',
                    userSelect: 'none'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={visibleMetrics[metric.key]} 
                      onChange={() => toggleMetric(metric.key)}
                      style={{
                        appearance: 'none',
                        width: '16px',
                        height: '16px',
                        border: '2px solid #000',
                        backgroundColor: visibleMetrics[metric.key] ? metric.color : '#fff',
                        marginRight: '8px',
                        position: 'relative',
                        boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                    {metric.name}
                  </label>
                ))}
              </div>
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
      flexDirection: 'column'
    }}>
      <h4 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: '#000080',
        paddingBottom: '8px',
        borderBottom: '1px solid #c0c0c0'
      }}>
        📊 Análisis de rendimiento
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
          <span style={{ marginRight: '6px' }}>🔎</span> Insight:
        </div>
        <div style={{ paddingLeft: '20px' }}>{chartConfig.insight}</div>
      </div>
    </div>
  );
};

export default ReelInsight;

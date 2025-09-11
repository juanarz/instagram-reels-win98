import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const ReelCorrelationAnalysis = ({ reelsData }) => {
  // Process data for analysis
  const processedData = reelsData.map(reel => ({
    name: reel.title,
    views: reel.views,
    likes: reel.likes,
    comments: reel.comments || 0,
    shares: reel.shares || 0,
    saves: reel.saves || 0,
    follows: reel.follows || 0
  }));

  // Calculate correlation matrix
  const getCorrelationMatrix = () => {
    const metrics = ['views', 'likes', 'comments', 'shares', 'saves', 'follows'];
    const matrix = [];
    
    metrics.forEach(metric1 => {
      const row = [];
      metrics.forEach(metric2 => {
        row.push(calculateCorrelation(
          processedData.map(d => d[metric1]),
          processedData.map(d => d[metric2])
        ));
      });
      matrix.push(row);
    });
    
    return { metrics, matrix };
  };

  // Helper function to calculate correlation
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    
    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator !== 0 ? numerator / denominator : 0;
  };

  // Generate correlation table columns
  const { metrics, matrix } = getCorrelationMatrix();
  const columns = [
    {
      title: 'Métrica',
      dataIndex: 'metric',
      key: 'metric',
      width: 100,
      fixed: 'left',
    },
    ...metrics.map((metric, i) => ({
      title: metric.charAt(0).toUpperCase() + metric.slice(1),
      dataIndex: metric,
      key: metric,
      render: (value) => ({
        props: {
          style: { 
            background: `rgba(24, 144, 255, ${Math.abs(value)})`,
            color: Math.abs(value) > 0.5 ? 'white' : 'black',
            fontWeight: Math.abs(value) > 0.7 ? 'bold' : 'normal',
          },
        },
        children: value.toFixed(2),
      }),
    })),
  ];

  const dataSource = metrics.map((metric, i) => ({
    key: i,
    metric: metric.charAt(0).toUpperCase() + metric.slice(1),
    ...Object.fromEntries(metrics.map((m, j) => [m, matrix[i][j]])),
  }));

  // Prepare scatter plot data
  const scatterData = processedData.map(d => ({
    shares: d.shares,
    follows: d.follows,
    name: d.name,
    size: Math.sqrt(d.views) / 10
  }));

  // Simple linear regression for prediction
  const x = processedData.map(d => d.shares);
  const y = processedData.map(d => d.follows);
  const n = x.length;
  const xSum = x.reduce((a, b) => a + b, 0);
  const ySum = y.reduce((a, b) => a + b, 0);
  const xySum = x.reduce((a, b, i) => a + b * y[i], 0);
  const xSquaredSum = x.reduce((a, b) => a + b * b, 0);
  
  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  const followersPer1kShares = Math.round(slope * 1000);

  return (
    <div style={{ 
      margin: '20px 0',
      padding: '15px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #c0c0c0',
      borderRadius: '4px',
      boxShadow: 'inset -1px -1px 0 0 #fff, inset 1px 1px 0 0 #808080',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ 
        margin: '0 0 15px 0', 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#000080',
        paddingBottom: '8px',
        borderBottom: '1px solid #c0c0c0'
      }}>
        📊 Análisis de Correlación y Predicción
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '14px', 
          color: '#000080',
          fontWeight: 'bold'
        }}>
          🔍 Mapa de Calor de Correlaciones
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            border: '1px solid #c0c0c0',
            fontSize: '12px'
          }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', border: '1px solid #c0c0c0', backgroundColor: '#e8e8e8' }}>Métrica</th>
                {metrics.map(metric => (
                  <th key={metric} style={{ 
                    padding: '8px', 
                    border: '1px solid #c0c0c0',
                    backgroundColor: '#e8e8e8',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataSource.map((row, i) => (
                <tr key={i}>
                  <td style={{ 
                    padding: '8px', 
                    border: '1px solid #c0c0c0',
                    fontWeight: 'bold',
                    backgroundColor: '#f8f8f8'
                  }}>
                    {row.metric}
                  </td>
                  {metrics.map((metric, j) => {
                    const value = row[metric];
                    const absValue = Math.abs(value);
                    const bgColor = absValue > 0.7 
                      ? value > 0 ? '#1f77b4' : '#ff7f0e' 
                      : absValue > 0.3 
                        ? value > 0 ? '#aec7e8' : '#ffbb78' 
                        : '#f0f0f0';
                    
                    return (
                      <td 
                        key={`${i}-${j}`}
                        style={{
                          padding: '8px',
                          border: '1px solid #c0c0c0',
                          backgroundColor: bgColor,
                          color: absValue > 0.5 ? 'white' : 'black',
                          fontWeight: absValue > 0.7 ? 'bold' : 'normal',
                          textAlign: 'center'
                        }}
                      >
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e8f4f8',
          borderRadius: '4px',
          border: '1px solid #c0c0c0',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Conclusiones clave:</p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Alta correlación positiva entre <strong>Shares y Follows</strong> ({matrix[3][5].toFixed(2)}): Los reels que se comparten más generan más seguidores nuevos.</li>
            <li>Alta correlación entre <strong>Likes y Views</strong> ({matrix[1][0].toFixed(2)}): El contenido que recibe muchas vistas tiende a recibir más me gusta.</li>
            <li>Baja correlación entre <strong>Comments y Follows</strong> ({matrix[2][5].toFixed(2)}): Los comentarios no siempre se traducen en nuevos seguidores.</li>
          </ul>
        </div>
      </div>
      
      <div>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '14px', 
          color: '#000080',
          fontWeight: 'bold'
        }}>
          📈 Relación entre Compartidos y Nuevos Seguidores
        </h4>
        <div style={{ 
          width: '100%',
          minHeight: '400px',
          height: '60vh',
          maxHeight: '600px',
          backgroundColor: 'white',
          border: '1px solid #c0c0c0',
          padding: '15px',
          marginBottom: '20px',
          position: 'relative',
          boxSizing: 'border-box'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart 
              margin={{ 
                top: 25, 
                right: 25, 
                bottom: 70, 
                left: 50 
              }}
              style={{
                fontSize: '0.9em'
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                type="number" 
                dataKey="shares" 
                name="Compartidos"
                label={{ 
                  value: 'Número de Compartidos', 
                  position: 'bottom',
                  offset: 10,
                  fill: '#333',
                  fontSize: 12
                }}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                type="number" 
                dataKey="follows" 
                name="Nuevos Seguidores"
                label={{ 
                  value: 'Nuevos Seguidores', 
                  angle: -90, 
                  position: 'left',
                  offset: 10,
                  fill: '#333',
                  fontSize: 12
                }}
                tick={{ fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="size" range={[100, 1000]} name="Vistas" />
              <Tooltip 
                formatter={(value, name) => [value, name === 'size' ? 'Vistas' : name]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #c0c0c0',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px',
                  position: 'absolute',
                  bottom: '10px',
                  left: 0,
                  right: 0,
                  margin: '0 auto',
                  width: '100%',
                  padding: '5px 0 0 0',
                  borderTop: '1px solid #f0f0f0'
                }}
                content={({ payload }) => (
                  <div style={{ 
                    textAlign: 'center',
                    paddingTop: '5px'
                  }}>
                    {payload.map((entry, index) => (
                      <span 
                        key={`legend-${index}`} 
                        style={{ 
                          display: 'inline-block', 
                          margin: '0 10px',
                          color: '#000',
                          fontSize: '12px'
                        }}
                      >
                        {entry.value === 'Línea de Tendencia' ? (
                          <span>
                            <svg width="14" height="14" viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                              <path fill="#ff7300" cx="16" cy="16" className="recharts-symbols" transform="translate(16, 16)" d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"></path>
                            </svg>
                            {entry.value}
                          </span>
                        ) : (
                          scatterData.map((reel, idx) => (
                            <span key={`reel-${idx}`} style={{ margin: '0 5px' }}>
                              <svg width="14" height="14" viewBox="0 0 32 32" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                                <path fill={COLORS[idx % COLORS.length]} cx="16" cy="16" className="recharts-symbols" transform="translate(16, 16)" d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"></path>
                              </svg>
                              {reel.name}
                            </span>
                          ))
                        )}
                      </span>
                    ))}
                  </div>
                )}
              />
              <Scatter name="Reels" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
              <Scatter 
                name="Línea de Tendencia" 
                data={[
                  { shares: 0, follows: intercept },
                  { shares: Math.max(...x), follows: intercept + slope * Math.max(...x) }
                ]} 
                line={{ stroke: '#ff7300', strokeWidth: 2, strokeDasharray: '5 5' }}
                shape={() => null}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div style={{ 
          padding: '10px',
          backgroundColor: '#e8f4f8',
          borderRadius: '4px',
          border: '1px solid #c0c0c0',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Predicción:</p>
          <p style={{ margin: '0' }}>
            En promedio, cada 1,000 shares generan aproximadamente <strong>{followersPer1kShares} seguidores</strong> nuevos.
            <br />
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: '#f0f0f0', 
              padding: '2px 5px', 
              marginTop: '5px',
              borderRadius: '3px',
              border: '1px solid #c0c0c0',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>
              Seguidores = {intercept.toFixed(2)} + {slope.toFixed(4)} × Compartidos
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReelCorrelationAnalysis;

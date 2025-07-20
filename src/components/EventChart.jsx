import { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const EventChart = ({ events }) => {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const getData = () => {
      const locations = [...new Set(events.map((event) => event.location))];
      const data = locations.map((location) => {
        const count = events.filter((event) => event.location === location).length
        const city = location.split(', ').shift()
        return { city, count };
      })
      return data;
    };

    const getPieData = () => {
      const genres = ['JavaScript', 'React', 'Node.js', 'jQuery', 'Angular'];
      const data = genres.map((genre) => {
        const count = events.filter((event) => event.summary.includes(genre)).length;
        return { name: genre, value: count };
      }).filter(item => item.value > 0);
      return data;
    };

    setData(getData());
    setPieData(getPieData());
  }, [events]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="charts-container">
      <div className="chart">
        <h2>Events by City</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="category" dataKey="city" name="City" />
            <YAxis type="number" dataKey="count" name="Number of events" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="chart">
        <h2>Events by Genre</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventChart;

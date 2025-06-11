import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  title: string;
  data: number[];
  color: string;
}

const ChartCard: React.FC<Props> = ({ title, data, color }) => {
  const chartData = data.map((v, i) => ({ name: i, value: v }));

  return (
    <div className="p-4 bg-white dark:bg-boxdark rounded shadow">
      <p className="font-medium mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke={color} dot={false} />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[0, 100]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;


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
=======
import { Card, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  data: { name: string; value: number }[];
}

export default function ChartCard({ title, data }: ChartCardProps) {
  return (
    <Card>
      <CardContent>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


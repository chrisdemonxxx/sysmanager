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

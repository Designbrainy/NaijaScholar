
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MockTestResult } from '../types';

interface DashboardProps {
  results: MockTestResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ results }) => {

  const averageScore = results.length > 0
    ? results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length
    : 0;

  const chartData = results.map((result, index) => ({
    name: `${result.subject.substring(0, 3)}. ${index + 1}`,
    score: (result.score / result.totalQuestions) * 100,
    subject: result.subject,
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-gray-800">Your Progress</h2>
        <p className="text-brand-gray-500">Welcome back! Here's how you're doing.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-gray-100">
          <h3 className="font-semibold text-brand-gray-500">Tests Taken</h3>
          <p className="text-3xl font-bold text-brand-green">{results.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-gray-100">
          <h3 className="font-semibold text-brand-gray-500">Average Score</h3>
          <p className="text-3xl font-bold text-brand-green">{averageScore.toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-gray-100">
        <h3 className="font-bold text-brand-gray-800 mb-4">Performance Trend</h3>
        {results.length > 0 ? (
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis unit="%" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 135, 83, 0.1)' }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{fontSize: '14px'}} />
                <Bar dataKey="score" fill="#008753" name="Score (%)" barSize={20} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-brand-gray-500">You haven't taken any mock tests yet.</p>
            <p className="text-sm text-brand-gray-400">Complete a test to see your performance here.</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-brand-gray-800 mb-2">Recent Tests</h3>
        <div className="space-y-3">
          {results.length > 0 ? (
            [...results].reverse().slice(0, 3).map((result, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-brand-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-brand-gray-700">{result.subject}</p>
                  <p className="text-sm text-brand-gray-500">{result.date}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-brand-green">
                        {((result.score / result.totalQuestions) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-brand-gray-400">
                        {result.score}/{result.totalQuestions} correct
                    </p>
                </div>
              </div>
            ))
          ) : (
             <p className="text-center text-sm text-brand-gray-500 py-4">No recent test history.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

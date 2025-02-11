import React, { useEffect, useState } from 'react'
import { fetchAssignmentMetrics } from '../api/assignments'

interface AssignmentMetrics {
  totalAssigned: number;
  successRate: string;
  failureReasons: {
    count: number;
    reason: string;
  }[];
}

const FailedOrders = () => {
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [failureCount, setFailureCount] = useState(0);

  useEffect(() => {
    fetchAssignmentMetrics().then((data) => {
      setMetrics(data);
      const totalFailureCount: number = data.failureReasons.reduce(
        (total: number, r: { count: number; reason: string }) => total + r.count,
        0
      );
      setFailureCount(totalFailureCount);
    });
  }, []);

  return (
        <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-gray-600">Total Failed Deliveries</span>
            <div className="text-3xl font-bold my-2">{failureCount}</div>
            <div className="text-sm text-gray-500 mb-2">Failure reasons:</div>

            {metrics?.failureReasons.map((item) => (
              <div key={item.reason} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>{item.reason}</span>
                  <span>
                    {item.count} /{" "}
                    {metrics.failureReasons.reduce(
                      (acc, reason) => acc + reason.count,
                      0
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-700 h-2 rounded-full"
                    style={{
                      width: `${
                        (item.count /
                          metrics.failureReasons.reduce(
                            (acc, reason) => acc + reason.count,
                            0
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
  )
}

export default FailedOrders

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import initialProjects from '../components/Projects';
import Project from '../type/Project'; // Assuming this is where your Project type is defined

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Typing the datasets for techData and yearData
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

// Typing the state for the chart data
interface ChartState {
  labels: string[];
  datasets: ChartDataset[];
}

const AnalyticsPage: React.FC = () => {
  const [techData, setTechData] = useState<ChartState>({ labels: [], datasets: [] });
  const [yearData, setYearData] = useState<ChartState>({ labels: [], datasets: [] });

  useEffect(() => {
    const techCounts: { [key: string]: number } = {};
    const yearCounts: { [key: string]: number } = {};

    initialProjects.forEach((project: Project) => {
      project.Technologies.forEach((tech: string) => {
        techCounts[tech] = (techCounts[tech] || 0) + 1;
      });

      const year = project.StartDate.split('-')[0];
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    setTechData({
      labels: Object.keys(techCounts),
      datasets: [
        {
          label: 'Number of Projects',
          data: Object.values(techCounts),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    });

    setYearData({
      labels: Object.keys(yearCounts).sort(),
      datasets: [
        {
          label: 'Number of Projects Started',
          data: Object.values(yearCounts),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, []);

  return (
    <div>
      <h2>Technologies and Their Number of Projects</h2>
      <Bar data={techData} options={{ responsive: true }} />
      
      <h2>Years and the Number of Projects Started</h2>
      <Bar data={yearData} options={{ responsive: true }} />
    </div>
  );
};

export default AnalyticsPage;

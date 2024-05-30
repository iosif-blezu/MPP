// src/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured Axios instance
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Project from '../type/Project'; // Make sure this path is correctly imported

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface ChartState {
  labels: string[];
  datasets: ChartDataset[];
}

const AnalyticsPage: React.FC = () => {
  const [techData, setTechData] = useState<ChartState>({ labels: [], datasets: [] });
  const [yearData, setYearData] = useState<ChartState>({ labels: [], datasets: [] });

  useEffect(() => {
    axios.get('/projects')
      .then(response => {
        const projects: Project[] = response.data;
        const techCounts: { [key: string]: number } = {};
        const yearCounts: { [key: string]: number } = {};

        projects.forEach((project: Project) => {
          project.Technologies.forEach((tech: string) => {
            techCounts[tech] = (techCounts[tech] || 0) + 1;
          });

          const year = project.StartDate.split('-')[0];
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        });

        setTechData({
          labels: Object.keys(techCounts),
          datasets: [{
            label: 'Number of Projects by Technology',
            data: Object.values(techCounts),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          }],
        });

        setYearData({
          labels: Object.keys(yearCounts).sort(),
          datasets: [{
            label: 'Number of Projects Started per Year',
            data: Object.values(yearCounts),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }],
        });
      })
      .catch(error => {
        console.error('Error fetching project data', error);
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

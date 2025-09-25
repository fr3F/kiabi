import { ApexOptions } from "ng-apexcharts";

export function getRadialBarChartOptions(progress: number): Partial<ApexOptions> {
  return {
    series: [progress],
    chart: { type: "radialBar", height: 250 },
    labels: [],
    plotOptions: {
      radialBar: {
        hollow: { size: "60%" },
        dataLabels: {
          show: true,
          name: { show: false }, 
          value: {
            fontSize: "50px",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: { colors: ["#00E396"] },
  };
}

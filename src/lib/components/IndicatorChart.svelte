<script>
    import { onDestroy } from 'svelte';
    import { Chart, registerables } from 'chart.js';

    Chart.register(...registerables);

    const { label, data, years, type = 'bar', mode = 'time' } = $props();

    let canvas;
    let chart;

    function formatValue(val) {
        if (mode === 'time') {
            return val;
        } else if (mode === 'structure') {
            return `${val.toFixed(2)}%`;
        }
    }

    function renderChart() {
        if (chart) chart.destroy();

        const chartData =
            mode === 'time'
                ? {
                      labels: years,
                      datasets: [
                          {
                              label,
                              data: years.map((y) => data?.[y] ?? 0),
                              backgroundColor:
                                  type === 'line'
                                      ? 'rgba(54, 162, 235, 0.4)'
                                      : 'rgba(54, 162, 235, 0.6)',
                              borderColor: 'rgba(54, 162, 235, 1)',
                              borderWidth: 1,
                              fill: false,
                              tension: 0.2,
                          },
                      ],
                  }
                : {
                      labels: years.map((y) => `${y}`),
                      datasets: [
                          {
                              label,
                              data: years.map((y) => data?.[y] ?? 0),
                              backgroundColor: [
                                  '#60a5fa',
                                  '#34d399',
                                  '#fbbf24',
                                  '#f87171',
                              ],
                              borderColor: '#fff',
                              borderWidth: 1,
                          },
                      ],
                  };

        chart = new Chart(canvas, {
            type: mode === 'structure' ? 'pie' : type,
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: mode === 'structure' },
                    title: {
                        display: true,
                        text: `Evoluție ${label}`,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                return `${ctx.label}: ${ctx.raw.toFixed(2)}${
                                    mode === 'structure' ? '%' : ''
                                }`;
                            },
                        },
                    },
                },
                scales:
                    mode === 'time'
                        ? {
                              y: {
                                  beginAtZero: true,
                                  ticks: {
                                      callback: (val) =>
                                          formatValue(val),
                                  },
                              },
                          }
                        : undefined,
            },
        });
    }

    $effect(() => {
        if (canvas) renderChart();
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

<div class="w-full max-w-xl mx-auto" style="height: 250px;">
    <canvas bind:this={canvas} class="w-full h-full"></canvas>
</div>

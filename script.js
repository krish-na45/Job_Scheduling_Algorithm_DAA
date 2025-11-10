document.getElementById('jobForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('jobsInput').value.trim();
  const jobs = input.split('\n').map(line => {
    const [id, deadline, profit] = line.split(',').map(x => x.trim());
    return { id, deadline: parseInt(deadline), profit: parseInt(profit) };
  });

  jobs.sort((a, b) => b.profit - a.profit);

  const maxDeadline = Math.max(...jobs.map(j => j.deadline));
  const slots = Array(maxDeadline).fill(null);
  let totalProfit = 0;

  jobs.forEach(job => {
    for (let i = job.deadline - 1; i >= 0; i--) {
      if (!slots[i]) {
        slots[i] = job;
        totalProfit += job.profit;
        break;
      }
    }
  });

  const scheduledJobs = slots.filter(j => j);
  let outputHTML = '<h3>Scheduled Jobs:</h3><table><tr><th>Job</th><th>Deadline</th><th>Profit</th></tr>';
  scheduledJobs.forEach(j => {
    outputHTML += <tr><td>${j.id}</td><td>${j.deadline}</td><td>${j.profit}</td></tr>;
  });
  outputHTML += </table><p><b>Total Profit: ${totalProfit}</b></p>;
  document.getElementById('output').innerHTML = outputHTML;

  const canvas = document.getElementById('ganttChart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scheduledJobs.forEach((j, index) => {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(index * 100 + 50, 100, 80, 40);
    ctx.fillStyle = '#000';
    ctx.fillText(j.id, index * 100 + 80, 125);
  });
});

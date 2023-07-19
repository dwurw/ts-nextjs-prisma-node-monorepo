export default function getGreetings(): string {
  const data: [number, string][] = [
    [22, 'Working late'],
    [18, 'Good evening'],
    [12, 'Good afternoon'],
    [5, 'Good morning'],
    [0, 'Whoa, early bird']
  ];

  const hr = new Date().getHours();

  for (let i = 0; i < data.length; i++) {
    if (hr >= data[i][0]) {
      return data[i][1] as string;
    }
  }
  
  return 'Good morning';
}

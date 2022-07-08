
export default function CustomDate({ ms }: { ms: number | string }) {
  if (typeof ms === 'string') {
    ms = parseInt(ms);
  }
  // formate the below string however you want
  const blogDate = new Date(ms);
  const dateString = (blogDate.getMonth() + 1) + ' - ' + blogDate.getDate() + ' - ' + blogDate.getFullYear();
  return (
    <>{dateString}</> 
  );
}
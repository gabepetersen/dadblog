
export default function CustomDate({ ms }: { ms: number }) {
  // formate the below string however you want
  const blogDate = new Date(ms);
  const dateString = (blogDate.getMonth() + 1) + ' - ' + blogDate.getDate() + ' - ' + blogDate.getFullYear();
  return (
    <p>{dateString}</p> 
  );
}
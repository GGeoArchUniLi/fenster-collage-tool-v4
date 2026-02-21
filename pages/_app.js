export default function App({ Component, pageProps }) {
  return (
    <>
      <style dangerouslySetInline={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f0f2f6; color: #111; }
        * { box-sizing: border-box; }
      `}} />
      <Component {...pageProps} />
    </>
  )
}

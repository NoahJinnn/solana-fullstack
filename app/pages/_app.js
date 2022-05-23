import ContextProvider from '../components/ContextProvider'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <ContextProvider>
    <Component {...pageProps} />
  </ContextProvider>
}

export default MyApp

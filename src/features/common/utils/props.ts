type Props = {
  authRedirect: string;
  srcPrefix: string;
};

const props: Props =
  process.env['NODE_ENV'] === 'development'
    ? {
        authRedirect: 'http://localhost:8082',
        srcPrefix: '',
      }
    : {
        authRedirect: 'https://chrisbas.github.io/track-assist/',
        srcPrefix: '/track-assist',
      };

export default props;

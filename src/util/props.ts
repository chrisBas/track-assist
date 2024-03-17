type Props = {
  authRedirect: string;
};

const props: Props =
  process.env["NODE_ENV"] === "development"
    ? {
        authRedirect: "http://localhost:8082",
      }
    : {
        authRedirect: "https://chrisbas.github.io/track-assist/",
      };

export default props;

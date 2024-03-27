export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-full mx-auto" />

      <section className="container grid grid-cols-1 md:grid md:grid-cols-3 mx-auto max-w-7xl py-4 md:py-8 gap-2 items-center">
        <div className="text-center md:text-left">
          <span>
            © 2024 Kwark Group. All rights reserved.
          </span>
        </div>
        <a
          href="https://netzo.io"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2"
        >
          <img
            src="/assets/built-with-netzo-light.svg"
            alt="Built with Netzo"
            className="h-8 w-auto mx-auto"
          />
        </a>
        <div className="text-center md:text-right">
          <a
            href="https://www.linkedin.com/company/kwark-group/"
            target="_blank"
          >
            <i className="mdi-linkedin w-8 h-8" />
          </a>
        </div>
      </section>
    </footer>
  );
};

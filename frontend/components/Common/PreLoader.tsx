import React from 'react';
const PreLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <div className="preloader">
        {/* Carretera */}
        <div className="cart__road"></div>

        {/* Líneas de movimiento */}
        <svg
          className="cart__motion"
          viewBox="0 0 60 140"
          width="60"
          height="140"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="20" y1="30" x2="60" y2="30" />
          <line x1="20" y1="50" x2="60" y2="50" />
          <line x1="20" y1="70" x2="60" y2="70" />
        </svg>

        {/* Carrito */}
        <svg
          className="cart"
          role="img"
          aria-label="Shopping cart line animation"
          viewBox="0 0 180 128"
          width="128"
          height="128"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
            <g className="cart__track">
              <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
              <circle cx="43" cy="111" r="13" />
              <circle cx="102" cy="111" r="13" />
            </g>

            <g className="cart__lines">
              <polyline
                className="cart__top"
                points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80"
                strokeDasharray="338 338"
                strokeDashoffset="-338"
              />
              <g className="cart__wheel1" transform="rotate(-90,43,111)">
                <circle
                  className="cart__wheel-stroke"
                  cx="43"
                  cy="111"
                  r="13"
                  strokeDasharray="81.68 81.68"
                  strokeDashoffset="81.68"
                />
              </g>
              <g className="cart__wheel2" transform="rotate(90,102,111)">
                <circle
                  className="cart__wheel-stroke"
                  cx="102"
                  cy="111"
                  r="13"
                  strokeDasharray="81.68 81.68"
                  strokeDashoffset="81.68"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Slogan animado con colores */}
      <div className="loader">
        <span className="letter white">L</span>
        <span className="letter white">O</span>
        <span className="letter white">Q</span>
        <span className="letter red">U</span>
        <span className="letter red">E</span>
        <span className="letter red">P</span>
        <span className="letter blue">I</span>
        <span className="letter blue">D</span>
        <span className="letter blue">A</span>
      </div>
    </div>
  );
};

export default PreLoader;

import React from 'react';

const Figure = ({
  title = '',
  placeholder = '',
  caption = '',
  width = 320,
  height = 320,
  src,
}) => (
  <figure className="figure">
    {src ? (
      <img src={src} className="figure-img rounded img-fluid" alt={caption} />
    ) : (
      <svg
        className="rounded img-fluid"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <title>{title}</title>
        <rect width="100%" height="100%" fill="#d0d0df"></rect>
        <text x="50%" y="50%" fill="#fff" dy=".3em">
          {placeholder}
        </text>
      </svg>
    )}
    <figcaption className="figure-caption text-center">{caption}</figcaption>
  </figure>
);

export default Figure;

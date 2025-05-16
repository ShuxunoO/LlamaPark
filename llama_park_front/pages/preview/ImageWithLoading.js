
import React, { useState, useEffect } from'react';
import { Loader } from "@lidofinance/lido-ui";

function ImageWithLoading({ src, alt }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false); // Set to false on error as well
  }, [src]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {isLoading? (
        <div className='w-full h-full flex justify-center items-center bg-slate-300'><Loader /></div>
      ) : (
        <img src={src} alt={alt} className=" w-full h-full object-cover" />
      )}
    </div>
  );
}

export default ImageWithLoading;
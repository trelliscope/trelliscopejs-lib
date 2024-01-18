import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  type: PanelType;
  src: string;
  alt: string;
  aspectRatio?: number;
  imageWidth: number;
  inTable?: boolean;
  port: number;
  sourceType: PanelSourceType;
  name: string;
  sourceClean: string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({
  type,
  src,
  alt,
  aspectRatio,
  imageWidth,
  inTable,
  port,
  sourceType,
  name,
  sourceClean,
}) => {
  const socketUrl = `ws://127.0.0.1:${port || '8080'}`;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      const socket = new WebSocket(socketUrl);
      socket.onopen = () => {
        socket.send(JSON.stringify({ panelName: name, panelURL: sourceClean }));
      };
      socket.onmessage = (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data = JSON.parse(event.data);
        socket.close();
      };
      socket.onclose = () => {
        setLoading(false);
      };
      // eslint-disable-next-line consistent-return
      return () => {
        // Clean up the WebSocket connection when the component unmounts
        socket.close();
      };
    };
    if (sourceType === 'localWebSocket') {
      loadImage();
    }
  }, [src, alt, sourceType, port, name, sourceClean, socketUrl]);

  const [imageLoaded, setImageLoaded] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  useEffect(() => {
    setImageLoaded(true);
  }, [src]);

  return (
    <div
      className={styles.panelGraphic}
      style={{
        width: imageWidth,
        height: imageWidth / (aspectRatio || 1),
        aspectRatio: inTable ? 'unset' : imageWidth === -1 ? aspectRatio || 1 : 'unset',
      }}
    >
      {type === 'iframe' && (
        <iframe
          key={`${src}_${window.innerWidth}`}
          width="100%"
          height="100%"
          // scrolling="no"
          src={src}
          title={alt}
        />
      )}
      {loading && sourceType === 'localWebSocket' ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        type === 'img' && (
          <>
            {imageLoaded ? (
              <img key={`${src}_${name}`} src={src} alt={alt} onLoad={handleImageLoad} onError={handleImageError} />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  color: '#9ba3af',
                  height: 'auto',
                  width: 'clamp(320px, 100vw, 800px)',
                  maxWidth: '100%',
                }}
              >
                No Image
              </Box>
            )}
          </>
        )
      )}
    </div>
  );
};

PanelGraphic.defaultProps = {
  aspectRatio: undefined,
  inTable: false,
};

export default PanelGraphic;

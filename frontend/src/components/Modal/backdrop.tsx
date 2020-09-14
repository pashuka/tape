import React from 'react';
const ModalBackdrop = () => {
  React.useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="modal-backdrop fade show"></div>;
};

export default ModalBackdrop;

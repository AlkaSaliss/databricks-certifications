import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function Confirm({ title, children, confirmLabel, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog className="confirm-dialog" ref={ref} onCancel={e => { e.preventDefault(); onCancel(); }} aria-labelledby="confirm-title">
    <div className="dialog-icon"><Icon name="clipboard" size={26} /></div><h2 id="confirm-title">{title}</h2><div className="dialog-body">{children}</div><div className="dialog-actions"><button className="secondary" onClick={onCancel} autoFocus>Keep going</button><button className="primary" onClick={onConfirm}>{confirmLabel}</button></div>
  </dialog>;
}

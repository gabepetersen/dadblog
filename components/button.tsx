import styles from './button.module.scss';

export default function Button({ children, style, ariaLabel, callback }:
  { children: React.ReactNode, style: string, ariaLabel: string, callback: (() => any) })
{
  const attributes = {
    className: style === 'secondary' ? styles.btn__secondary : styles.btn__primary,
    'aria-label': ariaLabel.length ? ariaLabel : null,
  }

  return (
    <>
      <button type="button" onClick={callback} {...attributes}>
        {children}
      </button>
    </>
  );
}
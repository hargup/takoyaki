/**
 * Takoyaki Button Component
 * ==========================
 *
 * Component representing Bulma buttons.
 */
import React from 'react';
import cls from 'classnames';

export default function Button(props) {
  const {
    children,
    level = 'primary',
    outlined = false,
    loading = false,
    onClick = Function.prototype
  } = props;

  const className = cls(
    'button',
    `is-${level}`,
    outlined && 'is-outlined',
    loading && 'is-loading'
  );

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
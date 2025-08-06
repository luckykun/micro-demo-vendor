import React from 'react';
import classNames from 'classnames';
import mi from '../../mi-utils';
import { renderComponent } from './utils';
import './index.scss';

const MicroApp = (props) => {
  const {
    className,
    name,
    ...rest
  } = props;
  const [flag, setFlag] = React.useState(false);
  const Application = mi.getApplication(name);

  const update = () => {
    setFlag(!flag);
  };

  React.useEffect(() => {
    !Application && renderComponent(name, update);
  }, []);

  const cls = classNames('micro-app-container', `micro-app-${name}`);
  return (
    <div className={cls}>
      {
        Application ? <Application {...rest} /> : 'loading...'
      }
    </div>
  );
};


export default MicroApp;

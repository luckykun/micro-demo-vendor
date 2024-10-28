import React from 'react';
import classNames from 'classnames';
import { _allMicroApplications, renderComponent } from './utils';

const MicroApp = (props) => {
  const {
    className,
    name,
    ...rest
  } = props;
  const [flag, setFlag] = React.useState(false);
  const Application = _allMicroApplications[name];

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

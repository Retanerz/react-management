const NotificationContainer = window.ReactNotifications.NotificationContainer;
const NotificationManager = window.ReactNotifications.NotificationManager;

class App extends React.Component {
  createNotification = type => () => {
    switch (type) {
      case 'info':
        NotificationManager.info('Info message');
        break;
      case 'success':
        NotificationManager.success('Success message', 'Title here');
        break;
      case 'warning':
        NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
        break;
      case 'error':
        NotificationManager.error('Error message', 'Click me!', 5000, () => {
          alert('callback');
        });
        break;
      default:
        break;
    }
  };
  render() {
    return ( 
      <div className='layout-page'>
        <main className='layout-main'>
          <div className='container'>
            <h2>React</h2>
            <hr/>
            <button className="btn btn-info" onClick={this.createNotification('info')}>
            Info
          </button>
          <hr/>
          <button className="btn btn-success" onClick={this.createNotification('success')}>
            Success
          </button>
          <hr/>
          <button className="btn btn-warning" onClick={this.createNotification('warning')}>
            Warning
          </button>
          <hr/>
          <button className="btn btn-danger" onClick={this.createNotification('error')}>
            Error
          </button>

          <NotificationContainer/>
          </div>
        </main>
      </div>
    );
  }
}

function run() {
  ReactDOM.render( < App / > , document.getElementById('app'));
}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}
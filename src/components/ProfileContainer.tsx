import { h } from 'preact';
import PureComponent from './PureComponent';

import Profile from './Profile';

interface Props {
  uid?: string;
  wcaProfile?: any;
}

class ProfileContainer extends PureComponent<Props, {}> {
  public handleLoginClick = async () => {

  };

  public handleAvatarClick = async () => {

  };

  public componentWillUnmount() {}

  public render() {
    return (
      <Profile
        loggedIn={!!this.props.wcaProfile}
        avatarImg={
          this.props.wcaProfile ? this.props.wcaProfile.avatar.thumb_url : ''
        }
        onAvatarClick={this.handleAvatarClick}
        onLoginClick={this.handleLoginClick}
      />
    );
  }
}

export default ProfileContainer;

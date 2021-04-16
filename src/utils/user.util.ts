class UserUtil {
  static formatAvatar(author: string): string[] {
    return author.split(' ').map((e) => (e?.[0] ? e[0] : ''));
  }
}

export default UserUtil;

export default {
  success(data: unknown) {
    return {
      success: true,
      code: 0,
      message: '',
      data,
    };
  }
}

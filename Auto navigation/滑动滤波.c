// 递推平均滤波法（又称滑动平均滤波法）
#define FILTER_N 12
int filter_buf[FILTER_N + 1];
int Filter(int iData) {
  int i;
  int filter_sum = 0;
  filter_buf[FILTER_N] = iData;
  for(i = 0; i < FILTER_N; i++) {
    filter_buf[i] = filter_buf[i + 1]; // 所有数据左移，低位仍掉
    filter_sum += filter_buf[i];
  }
  return (int)(filter_sum / FILTER_N);
}
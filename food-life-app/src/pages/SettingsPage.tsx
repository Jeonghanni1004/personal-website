import PageHeader from '../components/PageHeader';
import PageTransition from '../components/PageTransition';

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="page">
        <PageHeader title="账号与设置" />
        <div className="card divide-y divide-border overflow-hidden mb-6">
          {[
            { label: '昵称', value: '小满' },
            { label: '一句话', value: '今天也要好好吃饭' },
            { label: '通知', value: '已关闭（Demo）' },
            { label: '隐私', value: '仅自己可见日记' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between px-4 py-3.5 text-sm">
              <span className="text-ink-muted">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h3 className="font-display text-lg font-semibold mb-2">关于好好吃饭</h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            与进食相关的一切——进食是天大的事！
            <br />
            本期为 Mobile-first Web 原型，数据均为本地 Mock。
            <br />
            版本 1.0.0
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

---
title: "一期一逆向：这个排期器只在周日说真话"
section: "challenge"
id: "sunday-or-nothing"
period: "p2"
summary: "本期极客挑战给一段 14 行的 JavaScript：它在作者机器上输出可读字符串，在你机器上只有乱码。不是 bug，是你挑错了日子运行。"
publishedAt: "2026-10-29T09:00:00+08:00"
tags: ["极客挑战", "逆向", "JavaScript", "CTF"]
---

# 一期一逆向：这段排期器只在周日说真话

上一期是一首读起来别扭的诗。这一期更短——十行代码。

它是我给自己写的排期校验脚本，用来确认「当天该发哪一期」。它在我的机器上一直工作正常，输出一串可读的字符。但同事跑同一份文件，得到的只有乱码。

我坚持认为这不是 bug。因为它确实只在一个星期的某一天说真话——而在其他六天，它撒谎撒得很努力。

```js
#!/usr/bin/env node
// CaraFloa 排期校验器 v0.3
// 已知问题：输出与运行日期有关。只有某一天的结果是可读的。

const MASK = [0x20, 0x13, 0x2f, 0x41, 0x5c, 0x6e, 0x7b, 0x0d];
const ORDER = [7, 2, 11, 0, 5, 13, 3, 9, 1, 12, 6, 4, 10, 8];
const DATA = [
  0x59, 0x53, 0x4e, 0x4e, 0x44, 0x7f, 0x4e,
  0x4f, 0x59, 0x7f, 0x41, 0x4c, 0x55, 0x4f,
];

const day = new Date().getDay();   // 0 = 周日
const key = MASK[day];

process.stdout.write(
  ORDER.map((i) => (DATA[i] ^ key).toString(16).padStart(2, "0")).join(" ") + "\n"
);
```

保存为 `check.js`，`node check.js`。它输出的是一串十六进制字节，不是文本——这一步也算提醒：**先分清你拿到的是结论还是原料**。

答案格式是 `CaraFloa{...}`。

题目到这儿就没了。没有网络请求、没有外部文件、没有依赖——所有信息都在这十行里，包括那句 flag 本身。剩下的问题是：你要怎么让它在正确的日子说话。

> [!TIP]
> 三条递减的提示，卡住了再看：
> - 提示一：`DATA` 里的是 8 位无符号整数，不是索引，也不是偏移量。
> - 提示二：`ORDER` 决定顺序，`MASK` 决定解码方式，缺一个都只能得到乱码。
> - 提示三：周日对应的下标是 0；如果你不想等到周日，也可以自己给 `day` 赋值。

---

# 上一期解法：一首诗里藏了一句话

上一期（`p1`）的题目是《一期一隐写：这首诗里藏了一句话》，答案现在公布。

**答案：**

```text
CaraFloa{feat:_pushed_commits_to_the_moon_for_fun}
```

**怎么解出来的**

1. **先找异常。** 诗的文本没有任何拼写、标点或语法错误——作者甚至特意声明愿意为语法负责。唯一的异常是**大小写**：`oNe filE, OnE Slot` 这种写法既不符合句首大写规则，也不符合专有名词大写规则，显然是刻意为之。
2. **把大小写看成比特。** 忽略空格、标点、数字与换行，只保留字母；小写 = `0`，大写 = `1`。按出现顺序拼接，得到一条二进制串。
3. **每 8 位一组，按 ASCII 解码。** 全诗共 400 个字母 = 400 bit = 50 字节，正好对应 50 个字符的 flag——没有填充位，也没有残余比特。这个「刚好整除」本身就是答案正确的自校验。

**复现脚本：**

```python
import re

poem = open("poem.txt").read()
letters = "".join(ch for ch in poem if ch.isalpha())
bits = "".join("1" if ch.isupper() else "0" for ch in letters)
flag = "".join(chr(int(bits[i:i+8], 2)) for i in range(0, len(bits), 8))
print(flag)
# CaraFloa{feat:_pushed_commits_to_the_moon_for_fun}
```

**出题侧的几点补充**

- 载体是 CaraFloa 站点打油诗的英文版，诗句本身一字未改。flag 长度由 42 字符补到 50 字符（`_for_fun`），使载荷位数恰好等于原诗字母数——**先有诗，再反推能装多长的 flag**，而不是为了凑比特数去删诗句。
- 这类隐写的通用套路可以记住：先数载体的可用比特位，再按 8 位一组反推载荷长度，最后逐位强制大小写、回读解码验证。
- 顺带说一句：`feat:_pushed_commits_to_the_moon_for_fun` 这个 flag 是我在站点上线一周那篇里写过的自嘲——一周 45 次提交，成果全靠"往月亮上推提交"撑着。

本期题目在文章开头。解出来的话，答案格式别忘了带上 `CaraFloa{}`。

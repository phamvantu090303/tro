export const validate = (adminData) => {
  const newErrors = {};

  const rules = [
    {
      field: "email",
      checks: [
        { test: (v) => !v, message: "Email không được bỏ trống" },
        {
          test: (v) => v && !/\S+@\S+\.\S+/.test(v),
          message: "Email không hợp lệ",
        },
      ],
    },
    {
      field: "password",
      checks: [
        { test: (v) => !v, message: "Mật khẩu không được bỏ trống" },
        {
          test: (v) => v && v.length < 6,
          message: "Mật khẩu phải có ít nhất 6 ký tự",
        },
      ],
    },
    {
      field: "username",
      checks: [
        { test: (v) => !v, message: "Tên đăng nhập không được bỏ trống" },
      ],
    },
    {
      field: "ho_va_ten",
      checks: [
        { test: (v) => !v, message: "Họ và tên không được bỏ trống" },
        {
          test: (v) => v && /\d/.test(v),
          message: "Họ và tên không được chứa số",
        },
      ],
    },
    {
      field: "ngay_sinh",
      checks: [{ test: (v) => !v, message: "Ngày sinh không được bỏ trống" }],
    },
    {
      field: "que_quan",
      checks: [
        { test: (v) => !v, message: "Quê quán không được bỏ trống" },
        {
          test: (v) => v && /\d/.test(v),
          message: "Quê quán không được chứa số",
        },
      ],
    },
    {
      field: "so_dien_thoai",
      checks: [
        { test: (v) => !v, message: "Số điện thoại không được bỏ trống" },
        {
          test: (v) => v && !/^\d{10,11}$/.test(v),
          message: "Số điện thoại không hợp lệ",
        },
        {
          test: (v) => v && parseInt(v) < 0,
          message: "Số điện thoại không được âm",
        },
      ],
    },
    {
      field: "cccd",
      checks: [
        { test: (v) => !v, message: "CCCD không được bỏ trống" },
        {
          test: (v) => v && !/^\d{12}$/.test(v),
          message: "CCCD phải có 12 chữ số",
        },
        { test: (v) => v && parseInt(v) < 0, message: "CCCD không được âm" },
      ],
    },
    {
      field: "gioi_tinh",
      checks: [{ test: (v) => !v, message: "Giới tính không được bỏ trống" }],
    },
    {
      field: "id_quyen",
      checks: [{ test: (v) => !v, message: "Bạn phải chọn quyền" }],
    },
  ];

  for (const rule of rules) {
    const value = adminData[rule.field];
    for (const check of rule.checks) {
      if (check.test(value)) {
        newErrors[rule.field] = check.message;
        break; // dừng tại lỗi đầu tiên
      }
    }
  }

  return newErrors;
};

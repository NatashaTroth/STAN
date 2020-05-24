const purgecss = require("@fullhuman/postcss-purgecss")

module.exports = {
  style: {
    postcss: {
      plugins: [
        purgecss({
          content: ["./public/**/*.html"],
        }),
      ],
    },
  },
}

import { A, Q, el, text, placeholder, remove } from "../meta.mjs";
import { CG } from "../CG.mjs";
import { setStyle } from "../styling.mjs";

/**
 * This function applies styling to the authentication (login/signup) pages.
 * @returns {void}
 */
export function authView() {
  CG.dom.local.auth = {
    rows: [],

    inputs: {
      email: Q("#id_email") || Q("#id_login"),
      password: Q("#id_password") || Q("#id_password1"),

      // signup specific
      password2: Q("#id_password2"),
      fName: Q("#id_first_name"),
      lName: Q("#id_last_name"),
      accessCode: Q("#id_access_code"),
    },

    // login specific
    forgotPasswordLink: Q("a.forgot-password"),

    labels: {
      passwordConfirm: Q("label[for=id_password2] .input-label-text span"),
      fName: Q("label[for=id_first_name] span span"),
      lName: Q("label[for=id_last_name] span span"),
      email: Q("label[for=id_email]") || Q("label[for=id_login]"),
      accessCode: Q("label[for=id_access_code] span span"),
    },

    google: Q("#google_login"),
    TOS: Q("#access-message"),
    form: Q("#login_form") || Q("#signup_form"),
    btn: Q("#button-sign-in") || Q("#button-sign-up"),
    method: Q(".sj-text-sign-in-with") || Q(".sj-text-sign-up-with"),
    login: Q("#login-tab-left a span") || Q("#login-tab-left span span"),
    signup: Q("#login-tab-right a") || Q("#login-tab-right span"),

    get altMethod() {
      return Q("span", CG.dom.auth.method);
    },
  };

  text(CG.dom.local.auth.login, "Log In");
  text(CG.dom.local.auth.signup, "Sign Up");
  text(CG.dom.local.auth.google, "Continue with Google");
  text(CG.dom.local.auth.btn, CG.page.isLogin ? "Log In" : "Sign Up");
  text(CG.dom.local.auth.labels.email, "Work Email");

  placeholder(CG.dom.local.auth.inputs.email, "Work Email");

  if (CG.page.isSignup) {
    text(CG.dom.local.auth.labels.fName, "First Name");
    text(CG.dom.local.auth.labels.lName, "Last Name");
    placeholder(CG.dom.local.auth.inputs.fName, "First Name");
    placeholder(CG.dom.local.auth.inputs.lName, "Last Name");
    placeholder(CG.dom.local.auth.inputs.password2, "Password Confirm");
    text(CG.dom.local.auth.labels.passwordConfirm, "Password Confirm");
    text(CG.dom.local.auth.labels.accessCode, "Access Code (optional)");
  }

  const authContainer = el("div", { id: "auth-container" }, [
    Q("#tabs"),
    el("div", { className: "auth-card" }, [
      CG.dom.local.auth.form,
      el("div", { className: "divider" }, [el("span", { textContent: "or" })]),
      CG.dom.local.auth.google,
      CG.dom.local.auth.TOS,
    ]),
  ]);

  CG.dom.contentContainer.append(authContainer);

  // move "Forgot Password?" to after Password
  if (CG.page.isLogin && CG.dom.local.auth.inputs.password)
    CG.dom.local.auth.inputs.password.parentElement.append(
      CG.dom.local.auth.forgotPasswordLink
    );

  if (CG.page.isSignup) {
    // add aria-labels to inputs' parent .row elements
    A("input").forEach((elem) => {
      if (!elem.getAttribute("id")) return;

      CG.dom.local.auth.rows[elem.getAttribute("id")] = elem.closest(".row");
      CG.dom.local.auth.rows[elem.getAttribute("id")].setAttribute(
        "aria-label",
        elem.getAttribute("id")
      );
    });

    // move Access Code field to after Password Confirm
    CG.dom.local.auth.rows.id_password2.insertAdjacentElement(
      "afterend",
      CG.dom.local.auth.rows.id_access_code
    );

    // add focus listeners to fade in labels
    CG.dom.local.auth.inputs.accessCode.addEventListener("focus", () => {
      setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "1" });
    });

    CG.dom.local.auth.inputs.accessCode.addEventListener("blur", () => {
      if (CG.dom.local.auth.inputs.accessCode.value === "") {
        setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
      }
    });

    setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
  }

  remove(CG.dom.local.auth.method);
}

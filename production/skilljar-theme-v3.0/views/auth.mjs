import { A, Q, el, text, placeholder, remove, addEvtListeners } from "../utils.mjs";
import { CG } from "../CG.mjs";
import { setStyle } from "../styling.mjs";

// static imports
import { term } from "../../data/messages.mjs";

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
  };

  text(CG.dom.local.auth.login, term.logIn);
  text(CG.dom.local.auth.signup, term.signUp);
  text(CG.dom.local.auth.google, term.continueWithGoogle);
  text(CG.dom.local.auth.btn, CG.page.isLogin ? term.logIn : term.signUp);
  text(CG.dom.local.auth.labels.email, term.workEmail);

  placeholder(CG.dom.local.auth.inputs.email, term.workEmail);

  if (CG.page.isSignup) {
    text(CG.dom.local.auth.labels.fName, term.firstName);
    text(CG.dom.local.auth.labels.lName, term.lastName);
    placeholder(CG.dom.local.auth.inputs.fName, term.firstName);
    placeholder(CG.dom.local.auth.inputs.lName, term.lastName);
    placeholder(CG.dom.local.auth.inputs.password2, term.passwordConfirm);
    text(CG.dom.local.auth.labels.passwordConfirm, term.passwordConfirm);
    text(CG.dom.local.auth.labels.accessCode, term.accessCode);
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
      setStyle(CG.dom.local.auth.rows[elem.getAttribute("id")], {
        aria: { label: elem.getAttribute("id") },
      });
    });

    // move Access Code field to after Password Confirm
    CG.dom.local.auth.rows.id_password2.insertAdjacentElement(
      "afterend",
      CG.dom.local.auth.rows.id_access_code
    );

    // add focus listeners to fade in labels
    addEvtListeners(CG.dom.local.auth.inputs.accessCode, {
      focus: () => setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "1" }),
      blur: () => {
        if (CG.dom.local.auth.inputs.accessCode.value === "") {
          setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
        }
      },
    });

    setStyle(CG.dom.local.auth.rows.id_access_code, { opacity: "0.4" });
  }

  remove(CG.dom.local.auth.method);
}

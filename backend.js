
import { supabase } from "./supabase-client.js";

// HerStacks frontend backend helpers
const HerStacksBackend = {
  // Register a new member
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign in an existing member
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out the current member
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Check the current login session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get the current authenticated user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Test access to a table created in your schema
  async testConnection() {
    const { error } = await supabase
      .from("activities")
      .select("*", { head: true, count: "exact" });

    if (error) throw error;
    return true;
  },

  // Listen for login/logout changes
  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// Make the helpers available to your other browser scripts.
window.HerStacksBackend = HerStacksBackend;

// Optional connection check; an RLS or permission error
// may mean the table policies/grants still need setup.
HerStacksBackend.testConnection()
  .then(() => console.info("HerStacks: Supabase connection works."))
  .catch((error) => {
    console.warn("HerStacks: Connection/table access needs checking:", error.message);
  });

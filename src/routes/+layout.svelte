<script>
  import Header from './Header.svelte'
  import '../app.css'
  // import './styles.css';
</script>

<div class="app">
  <main class="bg-slate-300">
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    /* max-width: 64rem; */
    margin: 0 auto;
    box-sizing: border-box;
    overflow-y: auto;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>

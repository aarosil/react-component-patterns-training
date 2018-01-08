# React Component Patterns
Exploring different ways to create reusable functionality and shared state. Taken from Kent C. Dodds "Advanced Component Patterns" on egghead.io
---
### All examples use the simplest possible functionality, a Toggle component
### Extremely simple functionality is used so that it’s easier to see the differences between the patterns that are covered:
  - Compound Components
  - Higher Order Components
  - Render Props
  - Control Props
  - Provider Pattern

### Some patterns
  - are different ways of doing the same thing
  - can coexist to make a more flexible API

# The Toggle component
This component has all the state and functionality we’ll be exploring different ways to share and reuse
  - stores/displays a boolean value
  - exposes ability to set that value

```js
class Toggle extends Component {
  state = { on: false }
  toggle = () => this.setState(({on}) => ({ on: !on }))
  render() {
    const { on } = this.state
    return <Switch checked={on} onChange={this.toggle} />
  }
}
```

## Problem: state is embedded in the component
Right now, to extract the state from this component and “react” to it in your app, you need to have it accept a callback function as a prop and call it when the toggle changes:

Supply a callback when using toggle:
```js
<Toggle onToggle={console.log(‘toggle is: ‘, on)} />
```

Inside Toggle component, call the onToggle callback after state is updated:
```js
static defaultProps: {
  toggle: () => {} // no-op, don't cause error if not passed
}
toggle = () => {
  const {onToggle} = this.props
  this.setState(
    ({on}) => ({ on: !on })),
    () => onToggle(this.state.on)
  )
}
```

# Basic Compound Component
## Technique:
You have a Parent component where functionality and state is defined. This component provides state/functionality to direct children using `React.cloneElement` and supplementing the component’s props with the additional stuff.

## Example:
Toggle becomes our “compound parent”, storing `on`  value and `toggle` functionality, and we also have ancillary components that use these values:
```js
const ToggleOnText = ({on, children}) => on ? children : null
const ToggleOffText = ({on, children}) => on ? null : children
const ToggleButton = ({on, toggle, ...props}) => (
  <Switch checked={on} onChange={toggle} {...props} />
)
```

In Toggle’s render method we map over children with [React Children Utilities](https://reactjs.org/docs/react-api.html#reactchildren) and clone the element with new props to add the state and functionality:
```js
render() {
 return React.Children.map(
    this.props.children,
    child => React.cloneElement(child, {
      on: this.state.on,
      toggle: this.toggle
    })
  )
}
```

New Toggle API allows component consumer complete control over how the elements are placed, adding some flexibility to Toggle:
```js
<Toggle>
  <ToggleButton />
  <ToggleOnText>The toggle is on</ToggleOnText>
  <ToggleOffText>The toggle is off</ToggleOffText>
</Toggle>
```

## Problem: No Structural Flexibility
The new API does not provide structural flexibility. Toggle only adds the `on` and `toggle` props to direct children, so if ancillary elements above were nested in other elements, things would break.

# Compound Components Using Context
To allow structural flexibility of our compound component, we need to setup `Toggle` to provide context to our ancillary elements at any level of the descendant tree, not just the direct children.

## Technique:
You have a Parent component where functionality and state is defined. This component provides state/functionality to descendants who opt-in to it using [React’s Context API](https://reactjs.org/docs/context.html) .

## Example:
In shared scope, declare some longish variable that won’t clash with other contexts:
```
const TOGGLE_CONTEXT = '__v3_toggle__'
```

In `Toggle` Component, setup context. Don’t need to map over children now:
```js
static childContextTypes = {
  [TOGGLE_CONTEXT]: PropTypes.object.isRequired
}
getChildContext() {
  return {
    [TOGGLE_CONTEXT]: {
      on: this.state.on,
      toggle: this.toggle
    }
  }
}
render() {
  return <div>{this.props.children}</div>
}
```

In ancillary components, take things from context now, not props:
```js
const ToggleOnText = ({children}, context) => {
  const { on } = context[TOGGLE_CONTEXT]
  return on ? children : null
}
ToggleOnText.contextTypes = {
  [TOGGLE_CONTEXT]: PropTypes.object.isRequired
}
... // repeat for each
```

Now when we use `Toggle`, we have flexibility to structure things in our app however we want:
```js
<Toggle>
  <ToggleOnText>The toggle is on</ToggleOnText>
    <div>
      <ToggleOffText>The toggle is off</ToggleOffText>
    </div>
    <div>
    <ToggleButton />
    </div>
</Toggle>
```

## Problem: Burdensome/Experimental context API
Recap of steps to use context:
  - Define `childContextTypes` in compound parent component
  - Use a special key to define the context, shared with all other components that are using this context in the tree
  - Define `getChildContext` in the compound parent component, and return the values you want to be in the context
  - Each ancillary component declares they “need” the context by declaring `contextTypes`  referencing the same key, and now takes values from context instead of props

# Higher Order Component
You now have another component, `MyToggleButton`, that you would like to use with  `Toggle` in place of the ancillary `ToggleButton` one that already exists:

```js
const MyToggleButton = ({on, toggle}) =>
  <button onClick={toggle}>
    { on ? 'on' : 'off' }
  </button
```

Right now there’s a problem because this component is expecting things to be passed as props, but they’re now in the context instead. Since it’s an experimental API, we don’t really want to have to force consumers of `Toggle` to define `contextTypes` on any component they want to use with it. So how can we get around this? Create a higher order component that converts the context values to props:

## Technique
You have a Parent component where state and functionality is defined, and exposed through context. You provide a factory function that accepts a component, and returns a new component that renders the passed-in one with the values from context as props, thus abstracting the usage of the experimental context API from consumers.

## Example
```js
function withToggle(Component) {
  // NOTE: Wrapper could also be a class, if you need
  // component lifecycle hooks
  function Wrapper(props, context) {
    const toggleContext = context[TOGGLE_CONTEXT]
    return <Component {...toggleContext} {...props} />
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired
  }
  return Wrapper
}
```

We can use this to get the necessary props into our `MyToggleButton` component:

```js
WrappedMyToggleButton = withToggle(MyToggleButton)
```

We can also update our own ancillary components to use this higher order component, and now things are nicer since knowledge of context is restricted to fewer spots:

```js
const ToggleOnText = withToggle(({on, children}) => on ? children : null)
```

## Namespace clashes
Say you have a component that already takes a prop called  `on` . Say, to use as a click handler:

```js
const TriggerEvent = ({on}) => {
  return <button onClick={on}>trigger it</button>
}
```

You want to update this component to only render when `Toggle` state is on. You figure to wrap it with `withToggle`, so it can be aware, but now the prop names clash. Here is where the prop is getting overwritten:

```js
return <Component {...toggleContext} {...props} />
```

The `on` from toggle context is overwritten with the one from props. You could swap the order above, but that would reverse the problem. Instead, refactor the higher order component to namespace it’s props under `toggle`:

```js
return <Component {...props} toggle={toggleContext} />
```

Then refactor where `withToggle` is used, to access the props from this new location

## Improve debuggability
In your higher order function, monkey patch `displayName` property of the returned class/function to be something a little more useful in React devtools. Check for `name` or `displayName` of the passed-in component, to get proper name of both function and class components:

```js
Wrapper.displayName = `withToggle(${Component.displayName || Component.name})`
```

You’ll still see “unknown”, if you pass it an anonymous function

## Handle ref props
`ref` is a special prop that is not passed through to children. The next code doesn’t work, the ref prop will be to our  `Wrapper` component returned by `withToggle`, not the component `Something` :

```js
SomethingWithToggle = withToggle(Something)
...
<SomethingWithToggle
  ref={el => this.toggler = el} />
```

To work around this, observe an `innerRef` prop in the higher order component and use it for the `ref` of the wrapped component:

```js
function withToggle(Component) {
  function Wrapper({innerRef, ...props}, context) {
    ...
    return (
      <Component
      {...props}
      ref={innerRef}
      toggle={toggleContext}
      />
    )
  }
}
```

then use `innerRef` instead of `ref` wherever you needed a ref to the wrapped component:

```js
<SomethingWithToggle
  innerRef={el => this.toggler = el} />
```

## Improve unit testability
**Problem:** You’re trying to unit test a component that’s wrapped with `withToggle`, but in the unit test, there’s no ancestor providing the context to it, so it blows up.

```js
function test() {
  ...
  ReactDOM.render(
    <WrappedMyToggleButton
      on={false}
      toggle={() => toggle.called=true}
    />,
    div
  )
}
```

**Solution:** In your higher order function, add the original component as a static property called `WrappedComponent` to the class that is returned, and unit-test that.

```js
Wrapper.WrappedComponent = Component
```

in unit tests:
```js
  ...
  ReactDOM.render(
    <WrappedMyToggleButton.WrappedComponent
  ...
```

Another solution common in redux applications, is exporting the class without higher order component enhancement as a named export, and the enhanced one as the default export, then using the non-default named export in unit tests

## Handle static properties properly
**Problem** When using your higher order component, static class properties aren’t preserved:

```
class Foo extends Component {
  ...
  static Message = <strong>Yo dawg!</strong>
}
```

**Solution** Use `hoist-non-react-statics`  npm package, to preserve whatever non-React related static methods and properties were on the component that was passed in to it

```js
return hoistNonReactStatics(Wrapper, Component)
```

This makes using a higher order component more seamless and unobservable

# Render Props
## Technique
To give the consumers of the component more flexibility over what and how things are rendered, a given component is setup to store some state and some functionality, and instead of rendering anything, it simply calls a function passed by the consumer as a prop, with the given state and functionality as arguments.

## Example
We can update to our `Toggle` component from before, to accept a `render` prop, and render the result:

```js
class Toggle extends Component {
  ...
  render() {
    return this.props.render({
    on: this.state.on,
    toggle: this.toggle
    })
  }
}
```

Now all functionality and state is stored in `Toggle` but what gets actually rendered is completely up to consumer:

```js
<Toggle
  onToggle={console.log(‘toggle is: ‘, on)}
  render={({on, toggle}) => (
    <div>
      <Switch checked={on} onChange={toggle} />
      toggle is: {on ? 'on' : 'off'}
      { !on && <i className='ss-toiletpaper' /> }
    </div>
  )}
/>
```

## Contrast with Compound Components / HOCs
  - With HOC everything needs to be wrapped to get access to the state
    - Complications with creating a new wrapped component: displayName, WrappedComponent, statics, refs, naming collisions with props, etc
  - HOC implementation needs to be inspected to see where different props of a consuming component are provided from
    - Annoyance is compounded when consuming component is wrapped w/ several HOCs
  - Typescript: harder to type a HOC than a render prop
  - Biggest Difference: where composition takes place:
    - HOC: components composed statically during the construction phase of the application
    - Render Props: composition happens dynamically within React’s normal composition model: the render method

## Prop collections
Group collections of props to handle common use cases. For example if a certain group of props would be used on an `input` element, put them in an object called `inputProps`, then consumers can simply spread over this in input props instead of naming each one

## Prop getters
You’re providing an `onClick` to the consumer to use on button clicks, but the consumer also wants to run some code on that event as well. Solution: Parent calls the render function with a utility function called `getProps`, which composes their value of `onClick` with the default behavior. Useful to prevent consumer from knowing details of the prop collection

Could be useful also to mix `className` from consumers to the ones you want applied

# Control Props (controlled component)
## Technique
Similar to a controlled input (an input with `value` and `onChange` props set on it), sometimes users of your component want to have more control over what the internal state is. We can allow our custom component to be controlled (state values come from outside) or uncontrolled (component determines it’s own state). You could consider current implementation of `Toggle` component to be uncontrolled only - we can’t set value from outside.

To implement this technique you can create a method called `isControlled`, and use that to decide whether to update component state and which value to call render props with and return as context

## Example
Updating our `Toggle` component with a control prop:

```js
isOnControlled = () =>
  this.props.on !== undefined

toggle = () => {
  if (this.isOnControlled()) {
    this.props.onChange(!this.props.on)
  } else {
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onChange(this.state.on)
    )
  }
}

render() {
  return this.props.render({
    on: this.isOnControlled() // same in getChildContext
      ? this.props.on
      : this.state.on,
    toggle: this.toggle
  })
}
```

Now we are able to control the value of `Toggle` from outside the component

## Default Value vs. Controlled - state initializers
  - Use `initialState` static property
  - Can now reset back to `initialState`. Useful if state is large

# Context Provider
You want to access the state of `Toggle` throughout your whole app at any level of the component tree.

## Technique
To achieve this you can implement a Provider pattern for the component. This pattern involves two components: one Provider to place state into the context, and a Connected component which retrieves the state from context and gives it as props

### Provider Component
The goal of our provider is to provide values into context. The source of the values is our `Toggle` Component. So we’ll render that.

```js
class ToggleProvider extends Component {
  ...
  render() {
    const { children, ...otherProps } = this.props

    return (
      <Toggle {...otherProps}
        render={({on, toggle}) => (
        )}
      />
    )
  }
}
```

We still need to put those values on the context, and render the children. To achieve that, in our render prop passed to `Toggle` above, we’ll render a component that takes the props from `render` and makes them available on the context, and renders whatever children `ToggleProvider` has. We’ll create the class for this component as as a static property of `ToggleProvider`:

```js
contextKey = '__v3_toggle_provider'

static Renderer = class extends Component {
  static childContextTypes = {
    [ToggleProvider.contextKey]: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      [ToggleProvider.contextKey]: {
        on: this.props.on,
        toggle: this.props.toggle,
        reset: this.props.reset
      }
    }
  }

  render() {
    return this.props.children
  }
}
```

While we could just have `Toggle` itself provide the context and take on the role of the Provider, but doing things this way preserves the flexibility that we can still use `Toggle` somewhere as a child of `ToggleProvider` without resetting the context.

### Connected Component
Our Connected component is what we will use when we want access to `Toggle`’s state throughout our app. This component also uses a render prop,  and simply subscribes to the context values and calls the render prop with them:

```js
export function ConnectedToggle(props, context) {
  const { on, toggle, reset } = context[ToggleProvider.contextKey]

  return props.render({on, toggle, reset})
}

ConnectedToggle.contextTypes = {
  [ConnectedToggle.contextKey]: PropTypes.object.isRequired
}
```

Now our app looks like this:
```js
<ToggleProvider
    on={on}
    onChange={this.handleChange}
    onReset={this.handleReset}>
  <Header />
  <Layout />
  <Footer />
</ToggleProvider>
```

And we can access the state anywhere with our Connected component:

```js
<ConnectedToggle render={({on, toggle}) => (
  <div>
    <Switch checked={on} onChange={toggle}  />
    {on ? 'on' : 'off'}
  </div>
)} />
```

## HOC version of Connected component
Notice that it’s trivial to create a higher order component from our render prop connected component. We don’t need to add context, our existing `ConnectedToggle` can handle that:

```js
export function withToggle(Component) {
  function Wrapped(props, context) {
    return <ConnectedToggle
              render={toggleProps => (
                <Component
                  {...props}
                  {...toggleProps} />
              )}
            />
  }
  ...
  return hoistNonReactStatics(Wrapped, Component)
}
```

Now consumers have the choice to wrap components statically with `withToggle` or render more dynamically using `ConnectedToggle`’s render prop.

## Handle shouldComponentUpdate returning false blocking context updates
Your connected component could have an ancestor that is returning false in shouldComponentUpdate. It’s own props and state aren’t updated, so it returns false, not knowing that a child component is registered to context that has updated.

[`react-broadcast`](https://github.com/ReactTraining/react-broadcast) library has Broadcast and Subscriber components that work around this by setting state directly on all the Subscriber components
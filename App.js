import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal
} from 'react-native';

export default function App() {
  const [tela, setTela] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [posts, setPosts] = useState([
    {
      id: '1',
      titulo: 'Melhores trilhas em DF',
      autor: 'Carlos',
      mensagem: 'Alguém recomenda trilhas boas para MTB?',
      data: new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'}),
      likes: 0,
      dislikes: 0,
      comentarios: [],
      liked: {},
      disliked: {}
    },
    {
      id: '2',
      titulo: 'Capacete bom e barato?',
      autor: 'Ana',
      mensagem: 'Qual marca vocês indicam para iniciantes?',
      data: new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'}),
      likes: 0,
      dislikes: 0,
      comentarios: [],
      liked: {},
      disliked: {}
    },
    {
      id: '3',
      titulo: 'Grupos de ciclistas no DF',
      autor: 'João',
      mensagem: 'Alguem pode me indicar grupos de ciclismo por brasília',
      data: new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'}),
      likes: 0,
      dislikes: 0,
      comentarios: [],
      liked: {},
      disliked: {}
    }
  ]);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [novoComentario, setNovoComentario] = useState('');
  const [mostrarModalPost, setMostrarModalPost] = useState(false);

  const fazerLogin = () => {
    if (usuario && senha) setTela('forum');
  };

  const sair = () => {
    setUsuario('');
    setSenha('');
    setTela('login');
  };

  const adicionarPost = () => {
    if (novoTitulo && novaMensagem) {
      const novo = {
        id: (posts.length + 1).toString(),
        titulo: novoTitulo.slice(0, 50),
        autor: usuario || 'Anônimo',
        mensagem: novaMensagem.slice(0, 250),
        data: new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'}),
        likes: 0,
        dislikes: 0,
        comentarios: [],
        liked: {},
        disliked: {}
      };
      setPosts(prev => [novo, ...prev].sort((a, b) => b.likes - a.likes));
      setNovoTitulo('');
      setNovaMensagem('');
      setMostrarModalPost(false);
    }
  };

  const curtirPost = (id, tipo) => {
    const atualizados = posts.map(post => {
      if (post.id === id) {
        const liked = { ...post.liked };
        const disliked = { ...post.disliked };

        let likes = post.likes;
        let dislikes = post.dislikes;

        const jaCurtiu = !!liked[usuario];
        const jaDislikou = !!disliked[usuario];

        if (tipo === 'like') {
          if (jaCurtiu) {
            delete liked[usuario];
            likes--;
          } else {
            liked[usuario] = true;
            likes++;
            if (jaDislikou) {
              delete disliked[usuario];
              dislikes--;
            }
          }
        } else {
          if (jaDislikou) {
            delete disliked[usuario];
            dislikes--;
          } else {
            disliked[usuario] = true;
            dislikes++;
            if (jaCurtiu) {
              delete liked[usuario];
              likes--;
            }
          }
        }

        return { ...post, liked, disliked, likes, dislikes };
      }
      return post;
    });

    setPosts([...atualizados].sort((a, b) => b.likes - a.likes));
  };

  const comentarPost = () => {
    if (!novoComentario || !postSelecionado) return;
    const atualizados = posts.map(post => {
      if (post.id === postSelecionado.id) {
        const atualizado = {
          ...post,
          comentarios: [...post.comentarios, { autor: usuario, texto: novoComentario.slice(0, 250) }]
        };
        setPostSelecionado(atualizado);
        return atualizado;
      }
      return post;
    });
    setPosts(atualizados);
    setNovoComentario('');
  };

  const filtrarPosts = posts.filter(post =>
    post.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
    post.mensagem.toLowerCase().includes(pesquisa.toLowerCase())
  );

  if (tela === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Pedal Cerrado</Text>
        <Image
            source={{ uri: 'https://shorturl.at/9Srmo' }}
            style={styles.imageminicial}
          />
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => setTela(tela === 'perfil' ? 'forum' : 'perfil')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />
          <Text style={styles.usuarioNome}>{usuario || 'Usuário'}</Text>
        </TouchableOpacity>
      </View>

      {tela === 'perfil' ? (
        <View>
          <TouchableOpacity style={styles.botao} onPress={() => setTela('forum')}>
            <Text style={styles.botaoTexto}>Voltar ao Fórum</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSair} onPress={sair}>
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : postSelecionado ? (
        <View style={styles.postagem}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.postTitulo} numberOfLines={1}>
            {postSelecionado.titulo}
          </Text>
          <TouchableOpacity onPress={() => setPostSelecionado(null)}>
          <Text style={{ fontSize: 20 }}>✖</Text>
          </TouchableOpacity>
          </View>
          
          <Text style={styles.postAutor}>por {postSelecionado.autor} em {postSelecionado.data}</Text>
          <Text>{postSelecionado.mensagem}</Text>
          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Comentários:</Text>
          {postSelecionado.comentarios.map((c, i) => (
            <Text key={i}>- {c.autor}: {c.texto}</Text>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Digite um comentário"
            value={novoComentario}
            onChangeText={setNovoComentario}
          />
          <TouchableOpacity style={styles.botao} onPress={comentarPost}>
            <Text style={styles.botaoTexto}>Comentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar no fórum..."
            value={pesquisa}
            onChangeText={setPesquisa}
          />

          <FlatList
            data={filtrarPosts.sort((a, b) => b.likes - a.likes)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const jaCurtiu = !!item.liked[usuario];
              const jaDislikou = !!item.disliked[usuario];
              return (
                <TouchableOpacity style={styles.postagem} onPress={() => setPostSelecionado(item)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} style={styles.avatar} />
                    <Text style={styles.postAutor}> {item.autor} - {item.data}</Text>
                  </View>
                  <Text style={styles.postTitulo}>{item.titulo}</Text>
                  <Text>{item.mensagem}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <TouchableOpacity onPress={() => curtirPost(item.id, 'like')} style={{ marginRight: 10 }}>
                      <Text style={{ color: jaCurtiu ? '#4CAF50' : '#000' }}>🔼 {item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => curtirPost(item.id, 'dislike')}>
                      <Text style={{ color: jaDislikou ? '#f44336' : '#000' }}>🔽 {item.dislikes}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      {!postSelecionado && tela !== 'perfil' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
          <TouchableOpacity onPress={() => setMostrarModalPost(true)}>
            <Text style={{ fontSize: 20 }}>➕</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={mostrarModalPost} animationType="slide">
        <SafeAreaView style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Título do tópico"
            value={novoTitulo}
            maxLength={50}
            onChangeText={setNovoTitulo}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Mensagem"
            multiline
            maxLength={250}
            value={novaMensagem}
            onChangeText={setNovaMensagem}
          />
          <TouchableOpacity style={styles.botao} onPress={adicionarPost}>
            <Text style={styles.botaoTexto}>Postar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botao, { backgroundColor: '#888' }]} onPress={() => setMostrarModalPost(false)}>
            <Text style={styles.botaoTexto}>Cancelar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5'
  },
  cabecalho: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  usuarioNome: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  botaoTexto: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  postagem: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1
  },
  postTitulo: {
    fontWeight: 'bold',
    fontSize: 16
  },
  postAutor: {
    color: '#555',
    fontSize: 12,
    marginBottom: 4
  },
  imageminicial:{
    width: 300,
    height: 268,
    alignSelf: 'center',
    marginBottom:10
  },
  botaoSair: {
    backgroundColor: '#8B0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  }
});